using EmployeePayrollCalculation.Models;

namespace EmployeePayrollCalculation.Services.Interfaces;

public interface IEmployeeService
{
    IEnumerable<EmployeeManage> GetEmployeesToManage();
    
    void CreateEmployee(Employee employee);
}