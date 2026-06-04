using Microsoft.EntityFrameworkCore;
using StudentSupportInsights.Models;

namespace StudentSupportInsights.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Learner> Learners => Set<Learner>();
    public DbSet<Recommendation> Recommendations => Set<Recommendation>();
    public DbSet<AnalysisResult> AnalysisResults => Set<AnalysisResult>();
}
