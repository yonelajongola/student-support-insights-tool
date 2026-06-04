using Microsoft.AspNetCore.Mvc;
using StudentSupportInsights.Models;
using StudentSupportInsights.Services;

namespace StudentSupportInsights.Controllers;

/* LearnersController
 * Handles all HTTP endpoints related to learner records.
 * Base route: api/learners
 */
[ApiController]
[Route("api/[controller]")]
public class LearnersController : ControllerBase
{
    private readonly LearnerDataService _dataService;

    /* Constructor — injects LearnerDataService via dependency injection */
    public LearnersController(LearnerDataService dataService)
    {
        _dataService = dataService;
    }

    /* GET api/learners
     * Returns all learner records currently held in the data store.
     */
    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_dataService.GetAll());
    }

    /* POST api/learners
     * Adds a single learner record submitted as JSON in the request body.
     * Returns 400 Bad Request if validation errors are present.
     */
    [HttpPost]
    public IActionResult AddManual([FromBody] LearnerRecord learner)
    {
        var result = _dataService.AddManualRecord(learner);
        if (result.Errors.Count > 0)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /* POST api/learners/upload
     * Accepts a multipart CSV file upload and replaces the current data store
     * with the imported records.
     * Returns 400 Bad Request if the file is invalid or all rows fail to parse.
     */
    [HttpPost("upload")]
    public IActionResult UploadCsv([FromForm] IFormFile file)
    {
        var result = _dataService.ReplaceFromCsv(file);
        if (result.Errors.Count > 0 && result.ImportedCount == 0)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /* GET api/learners/export
     * Exports all learner records as a downloadable CSV file.
     */
    [HttpGet("export")]
    public IActionResult ExportCsv()
    {
        var csv = _dataService.ExportCsv();
        return File(System.Text.Encoding.UTF8.GetBytes(csv), "text/csv", "learner-export.csv");
    }
}
