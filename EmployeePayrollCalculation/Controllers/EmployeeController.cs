using EmployeePayrollCalculation.Models;
using EmployeePayrollCalculation.Services.Interfaces;
using EmployeePayrollCalculation.Utility;
using Microsoft.AspNetCore.Mvc;

namespace EmployeePayrollCalculation.Controllers;

[Route("api/employee")]
[ApiController]
public class EmployeeController : ControllerBase
{
    private readonly IEmployeeService _employeeService;

    public EmployeeController(IEmployeeService employeeService)
    {
        _employeeService = employeeService ?? throw new ArgumentNullException(nameof(employeeService));
    }

    [HttpGet("manage")]
    public IActionResult GetEmployeesToManage()
    {
        return Ok(_employeeService.GetEmployeesToManage());
    }
    
    public IActionResult CreateEmployee([FromBody] Employee employee)
    {
        if (employee == null) throw new ArgumentNullException(nameof(employee));

        _employeeService.CreateEmployee(employee);

        return Ok();
    }
}