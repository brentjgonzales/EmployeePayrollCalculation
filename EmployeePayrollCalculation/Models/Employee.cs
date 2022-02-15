using System.ComponentModel.DataAnnotations;
using EmployeePayrollCalculation.Utility;

namespace EmployeePayrollCalculation.Models;

public class Employee
{
    [Required]
    public string? EmployeeName { get; set; }
    
    [StringInListRequired]
    public IEnumerable<string>? DependentNames { get; set; }
}