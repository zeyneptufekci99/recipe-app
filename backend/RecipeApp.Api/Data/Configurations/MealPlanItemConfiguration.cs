using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecipeApp.Api.Models;

namespace RecipeApp.Api.Data.Configurations;

public class MealPlanItemConfiguration
    : IEntityTypeConfiguration<MealPlanItem>
{
    public void Configure(EntityTypeBuilder<MealPlanItem> builder)
    {
        builder.HasKey(item => item.Id);

        builder.Property(item => item.Date)
            .IsRequired();

        builder.Property(item => item.MealType)
            .IsRequired();

        builder.HasOne(item => item.User)
            .WithMany()
            .HasForeignKey(item => item.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(item => item.Recipe)
            .WithMany()
            .HasForeignKey(item => item.RecipeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(item => item.UserId);

        builder.HasIndex(item => new
        {
            item.UserId,
            item.Date,
            item.MealType
        })
        .IsUnique();
    }
}