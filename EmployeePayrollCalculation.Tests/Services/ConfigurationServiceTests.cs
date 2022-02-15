using System;
using System.Linq;
using EmployeePayrollCalculation.EFModels;
using EmployeePayrollCalculation.Services;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace EmployeePayrollCalculation.Tests.Services;

public class ConfigurationServiceTests
{
    
    [SetUp]
    public void Setup()
    {
        
    }
    
    private static void AddConfiguration(DbContextOptions<EmployeePayrollCalculationContext> options)
    {
        using var context = new EmployeePayrollCalculationContext(options);
        context.Configurations.Add(new Configuration()
        {
            Discount = 0.5M,
            DependentBenefitCost = 100,
            EmployeeBenefitCost = 200,
            SalaryPerPaycheck = 300,
            NumberOfPaychecksPerYear = 20
        });
        context.SaveChanges();
    }

    [Test]
    public void GetConfiguration()
    {
        // Arrange
        var options = Utility.CreateOptions();
        AddConfiguration(options);

        // Act
        using var context = new EmployeePayrollCalculationContext(options);
        var configurationService = new ConfigurationService(context);
        var configuration = configurationService.GetConfiguration();

        // Assert
        Assert.AreEqual(configuration.Discount, 0.5M);
        Assert.AreEqual(configuration.DependentBenefitCost, 100);
        Assert.AreEqual(configuration.EmployeeBenefitCost, 200);
        Assert.AreEqual(configuration.SalaryPerPaycheck, 300);
        Assert.AreEqual(configuration.NumberOfPaychecksPerYear, 20);
    }

    [Test]
    public void UpdateConfiguration()
    {
        // Arrange
        var options = Utility.CreateOptions();
        AddConfiguration(options);
        
        // Act
        using (var context = new EmployeePayrollCalculationContext(options))
        {
            var configurationService = new ConfigurationService(context);
            configurationService.UpdateConfiguration(new Models.Configuration()
            {
                Discount = 0.8M,
                DependentBenefitCost = 1000,
                EmployeeBenefitCost = 2000,
                SalaryPerPaycheck = 3000,
                NumberOfPaychecksPerYear = 200
            });
        }

        // Assert
        using (var context = new EmployeePayrollCalculationContext(options))
        {
            var configurationToAssert = context.Configurations.Single();
            Assert.AreEqual(configurationToAssert.Discount, 0.8M);
            Assert.AreEqual(configurationToAssert.DependentBenefitCost, 1000);
            Assert.AreEqual(configurationToAssert.EmployeeBenefitCost, 2000);
            Assert.AreEqual(configurationToAssert.SalaryPerPaycheck, 3000);
            Assert.AreEqual(configurationToAssert.NumberOfPaychecksPerYear, 200);
        }
    }
}