using EmployeePayrollCalculation.EFModels;
using EmployeePayrollCalculation.Services.Interfaces;

namespace EmployeePayrollCalculation.Services;

public class ConfigurationService : IConfigurationService
{
    private readonly EmployeePayrollCalculationContext _context;

    public ConfigurationService(EmployeePayrollCalculationContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }
    
    public Models.Configuration GetConfiguration()
    {
        return _context.Configurations
            .Select(x => new Models.Configuration()
            {
                SalaryPerPaycheck = x.SalaryPerPaycheck,
                NumberOfPaychecksPerYear = x.NumberOfPaychecksPerYear,
                EmployeeBenefitCost = x.EmployeeBenefitCost,
                DependentBenefitCost = x.DependentBenefitCost,
                Discount = x.Discount
            })
            .Single();
    }

    public void UpdateConfiguration(Models.Configuration configuration)
    {
        var efConfiguration = _context.Configurations.Single();
        efConfiguration.SalaryPerPaycheck = configuration.SalaryPerPaycheck;
        efConfiguration.NumberOfPaychecksPerYear = configuration.NumberOfPaychecksPerYear;
        efConfiguration.EmployeeBenefitCost = configuration.EmployeeBenefitCost;
        efConfiguration.DependentBenefitCost = configuration.DependentBenefitCost;
        efConfiguration.Discount = configuration.Discount;
        _context.SaveChanges();
    }
}