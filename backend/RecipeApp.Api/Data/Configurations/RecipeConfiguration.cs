using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecipeApp.Api.Models;

namespace RecipeApp.Api.Data.Configurations;

public class RecipeConfiguration: IEntityTypeConfiguration<Recipe>
{
    public void Configure(EntityTypeBuilder<Recipe> builder)
    {
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Title)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(r => r.Description)
            .HasMaxLength(1000);

        builder.Property(r => r.ImageUrl)
            .HasMaxLength(500);

        builder.Property(r => r.SourceUrl)
            .HasMaxLength(500);

        builder.HasMany(r => r.Ingredients)
            .WithOne(i => i.Recipe)
            .HasForeignKey(r => r.RecipeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(r => r.Steps)
            .WithOne(s => s.Recipe)
            .HasForeignKey(s => s.RecipeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
