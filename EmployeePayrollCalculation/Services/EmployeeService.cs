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

    public Models.Employee GetEmployee(int employeeId)
    {
        return _context.Employees
            .Where(x => x.EmployeeId == employeeId)
            .Select(x => new Models.Employee()
            {
                EmployeeName = x.EmployeeName,
                DependentNames = x.Dependents
                    .OrderBy(y => y.SortOrder)
                    .Select(y => y.DependentName)
            })
            .Single();
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

        AddDependentsToDatabase(employee, efEmployee.EmployeeId);

        _context.SaveChanges();

        transaction.Commit();
    }

    private void AddDependentsToDatabase(Models.Employee employee, int employeeId)
    {
        if (employee.DependentNames != null)
        {
            var dependentNames = employee.DependentNames.ToList();
            for (var i = 0; i < dependentNames.Count; i++)
            {
                var efDependent = new EFModels.Dependent()
                {
                    FkEmployeeId = employeeId,
                    SortOrder = i,
                    DependentName = dependentNames[i]
                };
                _context.Dependents.Add(efDependent);
            }
        }
    }

    public void UpdateEmployee(Models.Employee employee, int employeeId)
    {
        // Remove all existing dependents
        _context.Dependents.RemoveRange(_context.Dependents.Where(x => x.FkEmployeeId == employeeId));

        // Fetch the existing employee and change its name
        var efEmployee = _context.Employees.Single(x => x.EmployeeId == employeeId);
        efEmployee.EmployeeName = employee.EmployeeName!;
        
        AddDependentsToDatabase(employee, efEmployee.EmployeeId);
        
        _context.SaveChanges();
    }

    public void DeleteEmployee(int employeeId)
    {
        _context.Dependents.RemoveRange(_context.Dependents.Where(x => x.FkEmployeeId == employeeId));
        _context.Employees.RemoveRange(_context.Employees.Where(x => x.EmployeeId == employeeId));
        _context.SaveChanges();
    }
}