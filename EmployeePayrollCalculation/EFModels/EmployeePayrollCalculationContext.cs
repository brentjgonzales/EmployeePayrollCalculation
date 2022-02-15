using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace EmployeePayrollCalculation.EFModels
{
    public partial class EmployeePayrollCalculationContext : DbContext
    {
        public EmployeePayrollCalculationContext(DbContextOptions<EmployeePayrollCalculationContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Configuration> Configurations { get; set; } = null!;
        public virtual DbSet<Dependent> Dependents { get; set; } = null!;
        public virtual DbSet<Employee> Employees { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Configuration>(entity =>
            {
                entity.ToTable("Configuration");

                entity.Property(e => e.DependentBenefitCost).HasColumnType("decimal(19, 2)");

                entity.Property(e => e.Discount).HasColumnType("decimal(5, 2)");

                entity.Property(e => e.EmployeeBenefitCost).HasColumnType("decimal(19, 2)");

                entity.Property(e => e.SalaryPerPaycheck).HasColumnType("decimal(19, 2)");
            });

            modelBuilder.Entity<Dependent>(entity =>
            {
                entity.ToTable("Dependent");

                entity.Property(e => e.DependentName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.FkEmployee)
                    .WithMany(p => p.Dependents)
                    .HasForeignKey(d => d.FkEmployeeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Dependent_Employee");
            });

            modelBuilder.Entity<Employee>(entity =>
            {
                entity.ToTable("Employee");

                entity.Property(e => e.EmployeeName)
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
