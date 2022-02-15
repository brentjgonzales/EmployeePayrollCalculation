using EmployeePayrollCalculation.EFModels;
using EmployeePayrollCalculation.Services;
using EmployeePayrollCalculation.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IConfigurationService, ConfigurationService>();

builder.Services.AddDbContext<EmployeePayrollCalculationContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("EmployeePayrollCalculationDatabase")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();

