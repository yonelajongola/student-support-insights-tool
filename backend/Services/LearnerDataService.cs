using System.Globalization;
using StudentSupportInsights.DTOs;
using StudentSupportInsights.Models;

namespace StudentSupportInsights.Services;

/* LearnerDataService
 * Thread-safe in-memory store for learner records.
 * Automatically seeds from synthetic_learners.csv on first access.
 * Provides CSV import/export, manual record entry, and validation.
 */
public class LearnerDataService
{
    private static readonly HashSet<string> AllowedAgeBands = new(StringComparer.OrdinalIgnoreCase)
    {
        "18-24",
        "25-29",
        "30-35"
    };

    private static readonly HashSet<string> AllowedDeviceAccess = new(StringComparer.OrdinalIgnoreCase)
    {
        "Laptop",
        "Shared laptop",
        "Phone only"
    };

    private static readonly HashSet<string> AllowedInternetAccess = new(StringComparer.OrdinalIgnoreCase)
    {
        "Reliable",
        "Unstable",
        "Limited"
    };

    private static readonly HashSet<string> AllowedAttendanceRisk = new(StringComparer.OrdinalIgnoreCase)
    {
        "Low",
        "Medium",
        "High"
    };

    private readonly object _sync = new();      /* lock object for thread safety */
    private readonly List<LearnerRecord> _records = new();  /* in-memory record store */
    private bool _seedLoaded;                   /* ensures seed CSV is loaded only once */

    /* GetAll
     * Returns a deep-copied snapshot of all learner records.
     * Triggers seed data load on first call.
     */
    public List<LearnerRecord> GetAll()
    {
        EnsureSeedDataLoaded();
        lock (_sync)
        {
            return _records.Select(Clone).ToList();
        }
    }

    /* ReplaceFromCsv
     * Accepts an HTTP multipart file upload, parses it as CSV,
     * and replaces the entire record store with valid parsed rows.
     * Returns an UploadResultDto with imported/rejected counts and errors.
     */
    public UploadResultDto ReplaceFromCsv(IFormFile file)
    {
        EnsureSeedDataLoaded();

        if (file == null || file.Length == 0)
        {
            return new UploadResultDto { Errors = new List<string> { "No file uploaded." } };
        }

        using var stream = file.OpenReadStream();
        using var reader = new StreamReader(stream);
        return ReplaceFromCsvReader(reader);
    }

    /* ReplaceFromCsvReader
     * Core CSV parsing logic shared between file upload and test paths.
     * Expects header row then data rows with 12 columns.
     * Validates each row; rejected rows are counted and error messages collected.
     */
    public UploadResultDto ReplaceFromCsvReader(TextReader reader)
    {
        var result = new UploadResultDto();
        var imported = new List<LearnerRecord>();

        var headerLine = reader.ReadLine();
        if (string.IsNullOrWhiteSpace(headerLine))
        {
            result.Errors.Add("CSV file is empty.");
            return result;
        }

        var lineNumber = 1;
        while (true)
        {
            var line = reader.ReadLine();
            if (line == null)
            {
                break;
            }

            lineNumber++;
            if (string.IsNullOrWhiteSpace(line))
            {
                continue;
            }

            var columns = ParseCsvLine(line);
            if (columns.Count != 12)
            {
                result.RejectedCount++;
                AddValidationError(result, lineNumber, "CsvRow", "Expected 12 columns in the uploaded file.");
                continue;
            }

            var learner = new LearnerRecord
            {
                LearnerId = columns[0].Trim(),
                AgeBand = columns[1].Trim(),
                Province = columns[2].Trim(),
                DeviceAccess = columns[3].Trim(),
                InternetAccess = columns[4].Trim(),
                EmploymentStatus = columns[8].Trim(),
                SupportNeed = columns[9].Trim(),
                AttendanceRisk = columns[10].Trim(),
                Notes = columns[11].Trim()
            };

            if (!int.TryParse(columns[5], NumberStyles.Integer, CultureInfo.InvariantCulture, out var digital) ||
                !int.TryParse(columns[6], NumberStyles.Integer, CultureInfo.InvariantCulture, out var programming) ||
                !int.TryParse(columns[7], NumberStyles.Integer, CultureInfo.InvariantCulture, out var ai))
            {
                result.RejectedCount++;
                AddValidationError(result, lineNumber, "Confidence", "Digital, programming, and AI confidence values must be numeric.");
                continue;
            }

            learner.DigitalConfidence = digital;
            learner.ProgrammingConfidence = programming;
            learner.AiFamiliarity = ai;

            NormalizeControlledValues(learner);
            var validationErrors = Validate(learner, imported, lineNumber);
            if (validationErrors.Count > 0)
            {
                result.RejectedCount++;
                foreach (var validationError in validationErrors)
                {
                    result.ValidationErrors.Add(validationError);
                    result.Errors.Add($"Line {validationError.LineNumber}: {validationError.Message}");
                }

                continue;
            }

            imported.Add(learner);
        }

        lock (_sync)
        {
            _records.Clear();
            _records.AddRange(imported);
        }

        result.ImportedCount = imported.Count;
        return result;
    }

    /* AddManualRecord
     * Validates and appends a single learner record to the store.
     * Returns 400-compatible UploadResultDto if validation fails.
     */
    public UploadResultDto AddManualRecord(LearnerRecord learner)
    {
        EnsureSeedDataLoaded();

        NormalizeControlledValues(learner);

        var errors = Validate(learner, GetAll(), null);
        if (errors.Count > 0)
        {
            return new UploadResultDto
            {
                RejectedCount = 1,
                Errors = errors.Select(x => x.Message).ToList(),
                ValidationErrors = errors
            };
        }

        lock (_sync)
        {
            _records.Add(Clone(learner));
        }

        return new UploadResultDto { ImportedCount = 1 };
    }

    /* ExportCsv
     * Serialises all records to a CSV string with a header row.
     * Values containing commas or quotes are properly escaped.
     */
    public string ExportCsv()
    {
        EnsureSeedDataLoaded();
        var rows = new List<string>
        {
            "LearnerID,AgeBand,Province,DeviceAccess,InternetAccess,DigitalConfidence,ProgrammingConfidence,AIFamiliarity,EmploymentStatus,SupportNeed,AttendanceRisk,Notes"
        };

        rows.AddRange(GetAll().Select(r =>
            string.Join(',', new[]
            {
                Safe(r.LearnerId), Safe(r.AgeBand), Safe(r.Province), Safe(r.DeviceAccess), Safe(r.InternetAccess),
                r.DigitalConfidence.ToString(CultureInfo.InvariantCulture),
                r.ProgrammingConfidence.ToString(CultureInfo.InvariantCulture),
                r.AiFamiliarity.ToString(CultureInfo.InvariantCulture),
                Safe(r.EmploymentStatus), Safe(r.SupportNeed), Safe(r.AttendanceRisk), Safe(r.Notes)
            })));

        return string.Join(Environment.NewLine, rows);
    }

    /* EnsureSeedDataLoaded
     * Double-checked locking pattern to load synthetic_learners.csv
     * from several candidate paths relative to the app root.
     * No-op after the first successful or attempted load.
     */
    private void EnsureSeedDataLoaded()
    {
        if (_seedLoaded)
        {
            return;
        }

        lock (_sync)
        {
            if (_seedLoaded)
            {
                return;
            }

            var candidatePaths = new[]
            {
                Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "data", "Dataset", "synthetic_learners.csv"),
                Path.Combine(Directory.GetCurrentDirectory(), "..", "data", "Dataset", "synthetic_learners.csv"),
                Path.Combine(Directory.GetCurrentDirectory(), "data", "Dataset", "synthetic_learners.csv")
            };

            var existingPath = candidatePaths.Select(Path.GetFullPath).FirstOrDefault(File.Exists);
            if (!string.IsNullOrWhiteSpace(existingPath))
            {
                using var reader = new StreamReader(existingPath);
                var result = ReplaceFromCsvReader(reader);
                if (result.ImportedCount == 0 && result.Errors.Count > 0)
                {
                    Console.WriteLine("Seed load warning: " + string.Join(" | ", result.Errors));
                }
            }

            _seedLoaded = true;
        }
    }

    /* Validate
     * Checks required fields, numeric range constraints (confidence 1-5),
     * valid AttendanceRisk values (Low/Medium/High), and duplicate LearnerId.
     * Returns a list of error strings; empty list means valid.
     */
    private static List<ValidationErrorDto> Validate(LearnerRecord learner, IReadOnlyCollection<LearnerRecord> comparisonSet, int? lineNumber)
    {
        var errors = new List<ValidationErrorDto>();

        if (string.IsNullOrWhiteSpace(learner.LearnerId)) AddError(errors, lineNumber, "LearnerId", "Learner ID is required.");
        if (string.IsNullOrWhiteSpace(learner.AgeBand)) AddError(errors, lineNumber, "AgeBand", "Age band is required.");
        if (string.IsNullOrWhiteSpace(learner.Province)) AddError(errors, lineNumber, "Province", "Province is required.");
        if (string.IsNullOrWhiteSpace(learner.DeviceAccess)) AddError(errors, lineNumber, "DeviceAccess", "Device access is required.");
        if (string.IsNullOrWhiteSpace(learner.InternetAccess)) AddError(errors, lineNumber, "InternetAccess", "Internet access is required.");
        if (string.IsNullOrWhiteSpace(learner.EmploymentStatus)) AddError(errors, lineNumber, "EmploymentStatus", "Employment status is required.");
        if (string.IsNullOrWhiteSpace(learner.SupportNeed)) AddError(errors, lineNumber, "SupportNeed", "Support need is required.");

        if (!AllowedAgeBands.Contains(learner.AgeBand)) AddError(errors, lineNumber, "AgeBand", "Age band must be one of 18-24, 25-29, or 30-35.");
        if (!AllowedDeviceAccess.Contains(learner.DeviceAccess)) AddError(errors, lineNumber, "DeviceAccess", "Device access must be Laptop, Shared laptop, or Phone only.");
        if (!AllowedInternetAccess.Contains(learner.InternetAccess)) AddError(errors, lineNumber, "InternetAccess", "Internet access must be Reliable, Unstable, or Limited.");
        if (!AllowedAttendanceRisk.Contains(learner.AttendanceRisk)) AddError(errors, lineNumber, "AttendanceRisk", "Attendance risk must be Low, Medium, or High.");

        if (learner.DigitalConfidence < 1 || learner.DigitalConfidence > 5) AddError(errors, lineNumber, "DigitalConfidence", "Digital confidence must be between 1 and 5.");
        if (learner.ProgrammingConfidence < 1 || learner.ProgrammingConfidence > 5) AddError(errors, lineNumber, "ProgrammingConfidence", "Programming confidence must be between 1 and 5.");
        if (learner.AiFamiliarity < 1 || learner.AiFamiliarity > 5) AddError(errors, lineNumber, "AiFamiliarity", "AI familiarity must be between 1 and 5.");

        if (comparisonSet.Any(x => x.LearnerId.Equals(learner.LearnerId, StringComparison.OrdinalIgnoreCase)))
        {
            AddError(errors, lineNumber, "LearnerId", "Duplicate learner ID detected.");
        }

        return errors;
    }

    private static void NormalizeControlledValues(LearnerRecord learner)
    {
        learner.AgeBand = learner.AgeBand.Trim();
        learner.Province = learner.Province.Trim();
        learner.DeviceAccess = NormalizeValue(learner.DeviceAccess, AllowedDeviceAccess);
        learner.InternetAccess = NormalizeValue(learner.InternetAccess, AllowedInternetAccess);
        learner.AttendanceRisk = NormalizeValue(learner.AttendanceRisk, AllowedAttendanceRisk);
        learner.AgeBand = NormalizeValue(learner.AgeBand, AllowedAgeBands);
    }

    private static string NormalizeValue(string value, HashSet<string> allowedValues)
    {
        var match = allowedValues.FirstOrDefault(option => option.Equals(value.Trim(), StringComparison.OrdinalIgnoreCase));
        return match ?? value.Trim();
    }

    private static void AddValidationError(UploadResultDto result, int lineNumber, string field, string message)
    {
        result.ValidationErrors.Add(new ValidationErrorDto
        {
            LineNumber = lineNumber,
            Field = field,
            Message = message
        });
        result.Errors.Add($"Line {lineNumber}: {message}");
    }

    private static void AddError(List<ValidationErrorDto> errors, int? lineNumber, string field, string message)
    {
        errors.Add(new ValidationErrorDto
        {
            LineNumber = lineNumber,
            Field = field,
            Message = message
        });
    }

    private static List<string> ParseCsvLine(string line)
    {
        var values = new List<string>();
        var current = new System.Text.StringBuilder();
        var inQuotes = false;

        for (var index = 0; index < line.Length; index++)
        {
            var character = line[index];

            if (character == '"')
            {
                if (inQuotes && index + 1 < line.Length && line[index + 1] == '"')
                {
                    current.Append('"');
                    index++;
                }
                else
                {
                    inQuotes = !inQuotes;
                }

                continue;
            }

            if (character == ',' && !inQuotes)
            {
                values.Add(current.ToString());
                current.Clear();
                continue;
            }

            current.Append(character);
        }

        values.Add(current.ToString());
        return values;
    }

    /* Clone — creates a shallow copy of a LearnerRecord to prevent mutation of stored data */
    private static LearnerRecord Clone(LearnerRecord r) => new()
    {
        LearnerId = r.LearnerId,
        AgeBand = r.AgeBand,
        Province = r.Province,
        DeviceAccess = r.DeviceAccess,
        InternetAccess = r.InternetAccess,
        DigitalConfidence = r.DigitalConfidence,
        ProgrammingConfidence = r.ProgrammingConfidence,
        AiFamiliarity = r.AiFamiliarity,
        EmploymentStatus = r.EmploymentStatus,
        SupportNeed = r.SupportNeed,
        AttendanceRisk = r.AttendanceRisk,
        Notes = r.Notes
    };

    /* Safe — wraps a CSV field value in quotes and escapes internal quotes if needed */
    private static string Safe(string value)
    {
        if (value.Contains(',') || value.Contains('"'))
        {
            return "\"" + value.Replace("\"", "\"\"") + "\"";
        }

        return value;
    }
}
