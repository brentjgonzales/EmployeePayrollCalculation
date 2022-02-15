using EmployeePayrollCalculation.Models;
using EmployeePayrollCalculation.Services.Interfaces;
using EmployeePayrollCalculation.Utility;
using Microsoft.AspNetCore.Mvc;

namespace EmployeePayrollCalculation.Controllers;

[Route("api/configuration")]
[ApiController]
public class ConfigurationController : ControllerBase
{
    private readonly IConfigurationService _configurationService;

    public ConfigurationController(IConfigurationService configurationService)
    {
        _configurationService = configurationService ?? throw new ArgumentNullException(nameof(configurationService));
    }

    [HttpGet("")]
    public IActionResult GetConfiguration()
    {
        return Ok(_configurationService.GetConfiguration());
    }
    
    [HttpPut("")]
    public IActionResult UpdateConfiguration(Models.Configuration configuration)
    {
        _configurationService.UpdateConfiguration(configuration);
        return Ok();
    }
}