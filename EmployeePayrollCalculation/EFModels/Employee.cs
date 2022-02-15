using System;
using System.Collections.Generic;

namespace EmployeePayrollCalculation.EFModels
{
    public partial class Employee
    {
        public Employee()
        {
            Dependents = new HashSet<Dependent>();
        }

        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = null!;

        public virtual ICollection<Dependent> Dependents { get; set; }
    }
}
