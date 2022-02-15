using System;
using System.Collections.Generic;

namespace EmployeePayrollCalculation.EFModels
{
    public partial class Dependent
    {
        public int DependentId { get; set; }
        public string DependentName { get; set; } = null!;
        public int SortOrder { get; set; }
        public int FkEmployeeId { get; set; }

        public virtual Employee FkEmployee { get; set; } = null!;
    }
}
