using StudentSupportInsights.Services;

/* Program.cs — application entry point.
 * Registers services, configures CORS for the React frontend on port 3000,
 * maps controllers, and adds a /api/health check endpoint.
 */
var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddSingleton<LearnerDataService>();
builder.Services.AddSingleton<InsightsService>();

// Add CORS
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
if (allowedOrigins.Length == 0)
{
    allowedOrigins = new[] { "http://localhost:3000" };
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowConfiguredOrigins",
        policyBuilder => policyBuilder
            .WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowConfiguredOrigins");
app.MapControllers();

// Health check endpoint
app.MapGet("/api/health", () => new { status = "healthy", timestamp = DateTime.UtcNow })
    .WithName("HealthCheck");

app.MapGet("/api/health/ready", () => Results.Ok(new
{
    status = "ready",
    timestamp = DateTime.UtcNow,
    services = new[] { "LearnerDataService", "InsightsService" }
})).WithName("ReadinessCheck");

app.Run();
