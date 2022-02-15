using System;
using System.Collections.Generic;

namespace EmployeePayrollCalculation.EFModels
{
    public partial class Configuration
    {
        public int ConfigurationId { get; set; }
        public decimal SalaryPerPaycheck { get; set; }
        public int NumberOfPaychecksPerYear { get; set; }
        public decimal EmployeeBenefitCost { get; set; }
        public decimal DependentBenefitCost { get; set; }
        public decimal Discount { get; set; }
    }
}
