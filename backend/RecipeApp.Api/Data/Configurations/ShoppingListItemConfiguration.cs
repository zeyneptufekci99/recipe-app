using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecipeApp.Api.Models;

namespace RecipeApp.Api.Data.Configurations;

public class ShoppingListItemConfiguration
    : IEntityTypeConfiguration<ShoppingListItem>
{
    public void Configure(
        EntityTypeBuilder<ShoppingListItem> builder)
    {
        builder.HasKey(item => item.Id);

        builder.Property(item => item.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(item => item.Amount)
            .HasMaxLength(100);

        builder.HasOne(item => item.Recipe)
            .WithMany()
            .HasForeignKey(item => item.RecipeId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(item => item.ShoppingListId);
        builder.HasIndex(item => item.RecipeId);
    }
}