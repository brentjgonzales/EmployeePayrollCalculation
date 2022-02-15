using System.ComponentModel.DataAnnotations;

namespace EmployeePayrollCalculation.Utility;

public class StringInListRequired : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        var strings = value as IEnumerable<string>;
        if (strings == null)
        {
            return ValidationResult.Success;
        }

        if (strings.Any(string.IsNullOrEmpty))
        {
            return new ValidationResult("Each string must contain a value.");
        }
        
        return ValidationResult.Success;
    }
}