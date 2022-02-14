using EmployeePayrollCalculation.EFModels;
using EmployeePayrollCalculation.Models;
using EmployeePayrollCalculation.Services.Interfaces;

namespace EmployeePayrollCalculation.Services;

public class EmployeeService : IEmployeeService
{
    private readonly EmployeePayrollCalculationContext _context;

    public EmployeeService(EmployeePayrollCalculationContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }
    
    public IEnumerable<EmployeeManage> GetEmployeesToManage()
    {
        return _context.Employees
            .OrderBy(x => x.EmployeeName)
            .Select(x => new EmployeeManage()
            {
                EmployeeId = x.EmployeeId,
                EmployeeName = x.EmployeeName
            });
    }

    public void CreateEmployee(Models.Employee employee)
    {
        if (employee == null) throw new ArgumentNullException(nameof(employee));

        using var transaction = _context.Database.BeginTransaction();
        
        var efEmployee = new EFModels.Employee()
        {
            EmployeeName = employee.EmployeeName!
        };
        _context.Employees.Add(efEmployee);
        _context.SaveChanges();

        for (var i = 0; i < employee.DependentNames!.Count; i++)
        {
            var efDependent = new EFModels.Dependent()
            {
                FkEmployeeId = efEmployee.EmployeeId,
                SortOrder = i,
                DependentName = employee.DependentNames![0]!
            };
            _context.Dependents.Add(efDependent);
            _context.SaveChanges();
        }
            
        transaction.Commit();
    }
}