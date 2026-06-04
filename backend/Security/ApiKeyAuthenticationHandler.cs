using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace StudentSupportInsights.Security;

public sealed class ApiKeyAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public const string SchemeName = "ApiKey";

    private readonly IConfiguration _configuration;

    public ApiKeyAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        IConfiguration configuration)
        : base(options, logger, encoder)
    {
        _configuration = configuration;
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var configuredApiKey = _configuration["Security:ApiKey"]?.Trim();
        var apiKeyHeader = _configuration["Security:ApiKeyHeader"]?.Trim();

        if (string.IsNullOrWhiteSpace(apiKeyHeader))
        {
            apiKeyHeader = "X-API-Key";
        }

        if (!Request.Headers.TryGetValue(apiKeyHeader, out var providedValues))
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        var providedApiKey = providedValues.FirstOrDefault()?.Trim();
        if (string.IsNullOrWhiteSpace(providedApiKey) ||
            string.IsNullOrWhiteSpace(configuredApiKey) ||
            !string.Equals(providedApiKey, configuredApiKey, StringComparison.Ordinal))
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid API key."));
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "api-key-client"),
            new Claim(ClaimTypes.Name, "ApiKeyClient")
        };

        var identity = new ClaimsIdentity(claims, SchemeName);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, SchemeName);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
