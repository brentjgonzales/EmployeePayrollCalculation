using System;
using EmployeePayrollCalculation.EFModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace EmployeePayrollCalculation.Tests;

public static class Utility
{
    public static DbContextOptions<EmployeePayrollCalculationContext> CreateOptions()
    {
        return new DbContextOptionsBuilder<EmployeePayrollCalculationContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            // don't raise the error warning us that the in memory db doesn't support transactions - https://stackoverflow.com/a/44080734/5573838
            .ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;
    }

   
}