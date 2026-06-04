# Student Support Insights Tool - Azure CLI Deployment Script
# Frontend: Azure Storage Static Website
# Backend: Azure App Service for ASP.NET Core API
# Run from: C:\Users\Yonela\Downloads\Student_Support_Yonela_Jongola
# Usage:
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   .\deploy-student-support-azure-followup.ps1

$ErrorActionPreference = "Stop"

Write-Host "`n=== Student Support Insights Tool: Azure CLI Deployment ===`n"

# 1. Find Azure CLI even when 'az' is not on PATH
$azCommand = Get-Command az -ErrorAction SilentlyContinue
if ($azCommand) {
    $script:AzExe = $azCommand.Source
} else {
    $candidates = @(
        "C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd",
        "C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\wbin\az.cmd"
    )
    $script:AzExe = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
}

if (-not $script:AzExe) {
    Write-Host "ERROR: Azure CLI is installed according to winget, but az.cmd was not found."
    Write-Host "Fix by running:"
    Write-Host "  winget uninstall --exact --id Microsoft.AzureCLI"
    Write-Host "  winget install --exact --id Microsoft.AzureCLI --scope machine"
    Write-Host "Then close PowerShell and try again."
    exit 1
}

function Invoke-Az {
    & $script:AzExe @args
}

Write-Host "Using Azure CLI from: $script:AzExe"
Invoke-Az --version

# 2. Login
Write-Host "`nChecking Azure login..."
try {
    Invoke-Az account show --output none
    Write-Host "Already logged in."
} catch {
    Write-Host "Opening Azure login..."
    Invoke-Az login
}

Write-Host "`nCurrent subscription:"
Invoke-Az account show --query "{name:name, id:id, tenant:tenantId}" -o table

# Optional: set subscription manually by uncommenting and replacing value
# Invoke-Az account set --subscription "YOUR_SUBSCRIPTION_ID"

# 3. Find project folders automatically
$StartDir = (Get-Location).Path
Write-Host "`nSearching for frontend and backend inside: $StartDir"

$frontendPackage = Get-ChildItem -Path $StartDir -Recurse -Filter package.json -File |
    Where-Object { $_.FullName -match "\\frontend\\package\.json$" } |
    Select-Object -First 1

if (-not $frontendPackage) {
    $frontendPackage = Get-ChildItem -Path $StartDir -Recurse -Filter package.json -File |
        Select-Object -First 1
}

if (-not $frontendPackage) {
    throw "Could not find package.json. Run this script from the extracted project parent folder."
}

$FrontendDir = Split-Path $frontendPackage.FullName -Parent
$ProjectRoot = Split-Path $FrontendDir -Parent

$backendProject = Get-ChildItem -Path $ProjectRoot -Recurse -Filter *.csproj -File |
    Where-Object { $_.FullName -match "\\backend\\" } |
    Select-Object -First 1

if (-not $backendProject) {
    $backendProject = Get-ChildItem -Path $ProjectRoot -Recurse -Filter *.csproj -File |
        Select-Object -First 1
}

if (-not $backendProject) {
    throw "Could not find backend .csproj file."
}

$BackendDir = Split-Path $backendProject.FullName -Parent

Write-Host "Project root : $ProjectRoot"
Write-Host "Frontend dir : $FrontendDir"
Write-Host "Backend dir  : $BackendDir"
Write-Host "Backend csproj: $($backendProject.FullName)"

# 4. Deployment variables
$Location = "southafricanorth"
$Suffix = Get-Random -Minimum 10000 -Maximum 99999

$ResourceGroup = "rg-student-support-yj-$Suffix"
$PlanName = "asp-student-support-yj-$Suffix"
$ApiAppName = "student-support-api-yj-$Suffix"
$StorageName = ("ssiyj" + $Suffix).ToLower()
$Sku = "F1"
$Runtime = "DOTNETCORE:10.0"
$ApiKey = [Guid]::NewGuid().ToString("N")

Write-Host "`nDeployment names:"
Write-Host "Resource group : $ResourceGroup"
Write-Host "Location       : $Location"
Write-Host "API App        : $ApiAppName"
Write-Host "Storage        : $StorageName"
Write-Host "Plan SKU       : $Sku"
Write-Host "Runtime        : $Runtime"

# 5. Check available runtimes
Write-Host "`nAvailable .NET runtimes in Azure App Service Linux:"
$runtimes = Invoke-Az webapp list-runtimes --os linux -o tsv
$runtimes | Select-String "DOTNETCORE" | ForEach-Object { Write-Host $_ }

if ($runtimes -notmatch "DOTNETCORE[:|]10\.0") {
    Write-Warning "DOTNETCORE:10.0 was not listed. If App Service create fails, retarget backend to net8.0 or use a container deployment."
}

# 6. Create Azure resources
Write-Host "`nCreating resource group..."
Invoke-Az group create --name $ResourceGroup --location $Location -o table

Write-Host "`nCreating App Service plan..."
Invoke-Az appservice plan create --name $PlanName --resource-group $ResourceGroup --location $Location --is-linux --sku $Sku -o table

Write-Host "`nCreating backend API App Service..."
Invoke-Az webapp create --resource-group $ResourceGroup --plan $PlanName --name $ApiAppName --runtime $Runtime -o table

$ApiUrl = "https://$ApiAppName.azurewebsites.net"

Write-Host "`nSetting API app settings..."
Invoke-Az webapp config appsettings set `
    --resource-group $ResourceGroup `
    --name $ApiAppName `
    --settings ASPNETCORE_ENVIRONMENT=Production WEBSITE_RUN_FROM_PACKAGE=1 SUPPORT_TOOL_API_KEY=$ApiKey `
    -o table

# 7. Publish and deploy backend
$DeployRoot = "C:\Projects\student-support-azure-deploy-$Suffix"
$ApiPublish = Join-Path $DeployRoot "api-publish"
$ApiZip = Join-Path $DeployRoot "api.zip"

New-Item -ItemType Directory -Path $ApiPublish -Force | Out-Null

Write-Host "`nStopping .NET build server..."
dotnet build-server shutdown | Out-Null

Write-Host "`nPublishing backend..."
dotnet publish $backendProject.FullName --configuration Release --output $ApiPublish

if (Test-Path $ApiZip) { Remove-Item $ApiZip -Force }
Write-Host "`nCreating backend deployment zip..."
Compress-Archive -Path (Join-Path $ApiPublish "*") -DestinationPath $ApiZip -Force

Write-Host "`nDeploying backend to Azure App Service..."
Invoke-Az webapp deploy --resource-group $ResourceGroup --name $ApiAppName --src-path $ApiZip --type zip

# 8. Create Storage static website for frontend
Write-Host "`nCreating Azure Storage account for frontend static website..."
Invoke-Az storage account create `
    --resource-group $ResourceGroup `
    --name $StorageName `
    --location $Location `
    --sku Standard_LRS `
    --kind StorageV2 `
    -o table

$StorageKey = Invoke-Az storage account keys list --resource-group $ResourceGroup --account-name $StorageName --query "[0].value" -o tsv

Write-Host "`nEnabling static website hosting..."
Invoke-Az storage blob service-properties update `
    --account-name $StorageName `
    --account-key $StorageKey `
    --static-website `
    --index-document index.html `
    --404-document index.html

$FrontendUrl = Invoke-Az storage account show --resource-group $ResourceGroup --name $StorageName --query "primaryEndpoints.web" -o tsv
$FrontendOrigin = $FrontendUrl.TrimEnd("/")

Write-Host "Frontend URL will be: $FrontendUrl"
Write-Host "Backend API URL is:   $ApiUrl"

# 9. Build frontend with hosted API URL
Write-Host "`nBuilding frontend with VITE_API_BASE_URL=$ApiUrl"
Push-Location $FrontendDir
$env:VITE_API_BASE_URL = $ApiUrl

npm install
npm run typecheck
npm run build

Pop-Location

# 10. Upload frontend to Storage $web
$FrontendDist = Join-Path $FrontendDir "dist"

if (-not (Test-Path $FrontendDist)) {
    throw "Frontend dist folder was not created: $FrontendDist"
}

Write-Host "`nUploading frontend dist files to Azure Storage static website..."
Invoke-Az storage blob upload-batch `
    --account-name $StorageName `
    --account-key $StorageKey `
    --destination '$web' `
    --source $FrontendDist `
    --overwrite

# 11. Configure CORS and restart backend
Write-Host "`nConfiguring backend AllowedOrigins and App Service CORS..."
Invoke-Az webapp config appsettings set `
    --resource-group $ResourceGroup `
    --name $ApiAppName `
    --settings AllowedOrigins=$FrontendOrigin `
    -o table

Invoke-Az webapp cors add `
    --resource-group $ResourceGroup `
    --name $ApiAppName `
    --allowed-origins $FrontendOrigin

Write-Host "`nRestarting backend API..."
Invoke-Az webapp restart --resource-group $ResourceGroup --name $ApiAppName

# 12. Test endpoints
Write-Host "`nWaiting for API to restart..."
Start-Sleep -Seconds 20

Write-Host "`nTesting API health endpoint:"
try {
    Invoke-RestMethod "$ApiUrl/api/health" | ConvertTo-Json -Depth 10
} catch {
    Write-Warning "Health check did not respond yet. Wait 1-2 minutes and open: $ApiUrl/api/health"
}

# 13. Save output evidence
$OutputFile = Join-Path $DeployRoot "azure-hosting-output.txt"
@"
Student Support Insights Tool - Azure Hosting Output

Resource group:
$ResourceGroup

Frontend URL:
$FrontendUrl

Backend API URL:
$ApiUrl

Health check:
$ApiUrl/api/health

Allowed frontend origin:
$FrontendOrigin

API key stored in App Service setting:
SUPPORT_TOOL_API_KEY

Delete resources after demo:
az group delete --name $ResourceGroup --yes --no-wait
"@ | Set-Content -Path $OutputFile -Encoding UTF8

Write-Host "`n=== DEPLOYMENT COMPLETE ==="
Write-Host "Frontend URL: $FrontendUrl"
Write-Host "Backend API:  $ApiUrl"
Write-Host "Health:       $ApiUrl/api/health"
Write-Host "Output saved: $OutputFile"
Write-Host "`nTo delete after demo:"
Write-Host "az group delete --name $ResourceGroup --yes --no-wait"
