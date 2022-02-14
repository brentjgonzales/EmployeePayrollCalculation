using EmployeePayrollCalculation.Models;

namespace EmployeePayrollCalculation.Services.Interfaces;

public interface IEmployeeService
{
    Models.Employee GetEmployee(int employeeId);
    
    IEnumerable<EmployeeManage> GetEmployeesToManage();
    
    void CreateEmployee(Employee employee);
}