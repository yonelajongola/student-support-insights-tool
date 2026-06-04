using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentSupportInsights.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AnalysisResults",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LearnerId = table.Column<int>(type: "INTEGER", nullable: false),
                    RiskLevel = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    RiskScore = table.Column<int>(type: "INTEGER", nullable: false),
                    Recommendations = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnalysisResults", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Learners",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LearnerId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    AgeBand = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Province = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    DeviceAccess = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    InternetAccess = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    DigitalConfidence = table.Column<int>(type: "INTEGER", nullable: false),
                    ProgrammingConfidence = table.Column<int>(type: "INTEGER", nullable: false),
                    AIFamiliarity = table.Column<int>(type: "INTEGER", nullable: false),
                    EmploymentStatus = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    SupportNeed = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    AttendanceRisk = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Notes = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Learners", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Recommendations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Priority = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    AffectedLearnerIds = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recommendations", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnalysisResults");

            migrationBuilder.DropTable(
                name: "Learners");

            migrationBuilder.DropTable(
                name: "Recommendations");
        }
    }
}
