using System;
using System.Linq;
using EmployeePayrollCalculation.EFModels;
using EmployeePayrollCalculation.Models;
using EmployeePayrollCalculation.Services;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace EmployeePayrollCalculation.Tests.Services;

public class EmployeeServiceTests
{
    
    [SetUp]
    public void Setup()
    {
        
    }
    
    private static void AddEmployees(DbContextOptions<EmployeePayrollCalculationContext> options)
    {
        using var context = new EmployeePayrollCalculationContext(options);
        
        var efEmployee0 = new EFModels.Employee()
        {
            EmployeeName = "Amilia Bea"
        };
        context.Employees.Add(efEmployee0);
        
        var efEmployee1 = new EFModels.Employee()
        {
            EmployeeName = "Kelia Martie"
        };
        context.Employees.Add(efEmployee1);
        
        context.SaveChanges();
        
        var efDependent0 = new EFModels.Dependent()
        {
            FkEmployeeId = efEmployee0.EmployeeId,
            SortOrder = 0,
            DependentName = "Austin Clive"
        };
        context.Dependents.Add(efDependent0);
        
        var efDependent1 = new EFModels.Dependent()
        {
            FkEmployeeId = efEmployee0.EmployeeId,
            SortOrder = 1,
            DependentName = "Tania Joselyn"
        };
        context.Dependents.Add(efDependent1);
        
        context.SaveChanges();
    }
    
    [Test]
    public void GetEmployeesToManage()
    {
        // Arrange
        var options = Utility.CreateOptions();
        AddEmployees(options);

        // Act
        using var context = new EmployeePayrollCalculationContext(options);
        var employeeService = new EmployeeService(context);
        var employeesToManage = employeeService.GetEmployeesToManage().ToList();
        
        // Assert
        Assert.AreEqual(employeesToManage[0].EmployeeName, "Amilia Bea");
        Assert.AreEqual(employeesToManage[1].EmployeeName, "Kelia Martie");
    }
    
    [Test]
    public void GetEmployee()
    {
        // Arrange
        var options = Utility.CreateOptions();
        AddEmployees(options);

        // Act
        using var context = new EmployeePayrollCalculationContext(options);
        var employeeService = new EmployeeService(context);
        var employee = employeeService.GetEmployee(1);
        
        // Assert
        Assert.AreEqual(employee.EmployeeName, "Amilia Bea");
    }
    
    [Test]
    public void CreateEmployee()
    {
        // Arrange
        var options = Utility.CreateOptions();

        // Act
        using var context = new EmployeePayrollCalculationContext(options);
        var employeeService = new EmployeeService(context);
        employeeService.CreateEmployee(new Models.Employee()
        {
            EmployeeName = "Troy Treasure",
            DependentNames = new[] {"Pearl Theo", "Marci Tristram"}
        });

        // Assert
        var employee = context.Employees
            .Select(x => new
            {
                x.EmployeeName,
                Dependents = x.Dependents
                    .Select(y => y.DependentName)
                    .ToList()
            })
            .Single();
        Assert.AreEqual(employee.EmployeeName, "Troy Treasure");
        Assert.AreEqual(employee.Dependents[0], "Pearl Theo");
        Assert.AreEqual(employee.Dependents[1], "Marci Tristram");
    }

    [Test]
    public void UpdateEmployee()
    {
        // Arrange
        var options = Utility.CreateOptions();
        AddEmployees(options);

        // Act
        using var context = new EmployeePayrollCalculationContext(options);
        var employeeService = new EmployeeService(context);
        employeeService.UpdateEmployee(new Models.Employee()
        {
            EmployeeName = "Lela Pamela",
            DependentNames = new[] {"Pearl Theo", "Marci Tristram"}
        }, 1);

        // Assert
        var employee = context.Employees
            .Where(x => x.EmployeeId == 1)
            .Select(x => new
            {
                x.EmployeeName,
                Dependents = x.Dependents
                    .Select(y => y.DependentName)
                    .ToList()
            })
            .Single();
        Assert.AreEqual(employee.EmployeeName, "Lela Pamela");
        Assert.AreEqual(employee.Dependents[0], "Pearl Theo");
        Assert.AreEqual(employee.Dependents[1], "Marci Tristram");
    }
    
    [Test]
    public void DeleteEmployee()
    {
        // Arrange
        var options = Utility.CreateOptions();
        AddEmployees(options);

        // Act
        using var context = new EmployeePayrollCalculationContext(options);
        var employeeService = new EmployeeService(context);
        employeeService.DeleteEmployee(1);

        // Assert
        var employeeCountWithMatchingName = context.Employees
            .Count(x => x.EmployeeName == "Amilia Bea");
        Assert.AreEqual(employeeCountWithMatchingName, 0);
    }
}