namespace EmployeePayrollCalculation.Services.Interfaces;

public interface IConfigurationService
{
    Models.Configuration GetConfiguration();

    void UpdateConfiguration(Models.Configuration configuration);
}