namespace EmployeePayrollCalculation.Models;

public class Configuration
{
    public decimal SalaryPerPaycheck { get; set; }
    public int NumberOfPaychecksPerYear { get; set; }
    public decimal EmployeeBenefitCost { get; set; }
    public decimal DependentBenefitCost { get; set; }
    public decimal Discount { get; set; }
}