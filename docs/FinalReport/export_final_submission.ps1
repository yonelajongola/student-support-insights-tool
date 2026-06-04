param(
    [string]$RootPath = "c:\Users\Yonela\Downloads\Student_Support_Insights_Tool_ACADEMIC_UI_REDESIGN_Yonela_Jongola\student-support-insights-tool-clean"
)

$mdPath = Join-Path $RootPath "docs\FinalReport\final_submission.md"
$htmlPath = Join-Path $RootPath "docs\FinalReport\final_submission_export.html"
$docxPath = Join-Path $RootPath "docs\FinalReport\final_submission.docx"
$pdfPath = Join-Path $RootPath "docs\FinalReport\final_submission.pdf"

function Escape-Html([string]$text) {
    if ($null -eq $text) { return "" }

    return $text.Replace('&', '&amp;').Replace('<', '&lt;').Replace('>', '&gt;')
}

function Render-Inline([string]$text) {
    $encoded = Escape-Html $text
    $encoded = [regex]::Replace($encoded, '`([^`]+)`', '<code>$1</code>')
    $encoded = [regex]::Replace($encoded, '\*\*([^*]+)\*\*', '<strong>$1</strong>')
    $encoded = [regex]::Replace($encoded, '\*([^*]+)\*', '<em>$1</em>')
    return $encoded
}

function Flush-Paragraph($builder, $paragraphLines) {
    if ($paragraphLines.Count -eq 0) {
        return
    }

    $text = ($paragraphLines.ToArray() -join ' ')
    [void]$builder.AppendLine('<p>' + (Render-Inline $text) + '</p>')
    $paragraphLines.Clear()
}

function Close-List($builder, [ref]$listMode) {
    if ($listMode.Value -eq 'ul') {
        [void]$builder.AppendLine('</ul>')
    }
    elseif ($listMode.Value -eq 'ol') {
        [void]$builder.AppendLine('</ol>')
    }

    $listMode.Value = ''
}

$lines = Get-Content -Path $mdPath
$builder = New-Object System.Text.StringBuilder
$paragraphLines = New-Object System.Collections.Generic.List[string]
$listMode = ''

[void]$builder.AppendLine('<!DOCTYPE html>')
[void]$builder.AppendLine('<html><head><meta charset="utf-8" /><title>Final Submission Document</title>')
[void]$builder.AppendLine('<style>body{font-family:Calibri,Segoe UI,Arial,sans-serif;line-height:1.45;margin:36px;color:#1f2937;}h1,h2,h3,h4{color:#0f172a;margin-top:24px;margin-bottom:12px;}h1{font-size:24pt;}h2{font-size:18pt;}h3{font-size:14pt;}p{margin:0 0 12px;}ul,ol{margin:0 0 12px 24px;}li{margin:0 0 6px;}code{font-family:Consolas,monospace;background:#f3f4f6;padding:1px 4px;border-radius:3px;}img{max-width:100%;height:auto;border:1px solid #d1d5db;margin:8px 0 14px;}figure{margin:18px 0;}figcaption{font-size:10pt;color:#4b5563;}blockquote{border-left:4px solid #cbd5e1;padding-left:12px;color:#475569;margin:12px 0;}</style>')
[void]$builder.AppendLine('</head><body>')

foreach ($line in $lines) {
    if ($line -match '^\s*$') {
        Flush-Paragraph $builder $paragraphLines
        Close-List $builder ([ref]$listMode)
        continue
    }

    if ($line -match '^(#{1,6})\s+(.*)$') {
        Flush-Paragraph $builder $paragraphLines
        Close-List $builder ([ref]$listMode)
        $level = $matches[1].Length
        [void]$builder.AppendLine("<h$level>" + (Render-Inline $matches[2]) + "</h$level>")
        continue
    }

    if ($line -match '^!\[(.*?)\]\((.*?)\)$') {
        Flush-Paragraph $builder $paragraphLines
        Close-List $builder ([ref]$listMode)
        $alt = Render-Inline $matches[1]
        $src = $matches[2]
        [void]$builder.AppendLine("<figure><img src=`"$src`" alt=`"$alt`" /><figcaption>$alt</figcaption></figure>")
        continue
    }

    if ($line -match '^>\s?(.*)$') {
        Flush-Paragraph $builder $paragraphLines
        Close-List $builder ([ref]$listMode)
        [void]$builder.AppendLine('<blockquote><p>' + (Render-Inline $matches[1]) + '</p></blockquote>')
        continue
    }

    if ($line -match '^[-*]\s+(.*)$') {
        Flush-Paragraph $builder $paragraphLines
        if ($listMode -ne 'ul') {
            Close-List $builder ([ref]$listMode)
            [void]$builder.AppendLine('<ul>')
            $listMode = 'ul'
        }

        [void]$builder.AppendLine('<li>' + (Render-Inline $matches[1]) + '</li>')
        continue
    }

    if ($line -match '^\d+\.\s+(.*)$') {
        Flush-Paragraph $builder $paragraphLines
        if ($listMode -ne 'ol') {
            Close-List $builder ([ref]$listMode)
            [void]$builder.AppendLine('<ol>')
            $listMode = 'ol'
        }

        [void]$builder.AppendLine('<li>' + (Render-Inline $matches[1]) + '</li>')
        continue
    }

    $paragraphLines.Add($line.Trim())
}

Flush-Paragraph $builder $paragraphLines
Close-List $builder ([ref]$listMode)
[void]$builder.AppendLine('</body></html>')

[System.IO.File]::WriteAllText($htmlPath, $builder.ToString(), [System.Text.Encoding]::UTF8)

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    $doc = $word.Documents.Open($htmlPath)
    $doc.SaveAs2($docxPath, 16)
    $doc.ExportAsFixedFormat($pdfPath, 17)
    $doc.Close()
}
finally {
    $word.Quit()
}

Write-Output "Created: $docxPath"
Write-Output "Created: $pdfPath"
Write-Output "Created: $htmlPath"