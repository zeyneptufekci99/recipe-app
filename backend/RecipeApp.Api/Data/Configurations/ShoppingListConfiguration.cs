using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecipeApp.Api.Models;

namespace RecipeApp.Api.Data.Configurations;

public class ShoppingListConfiguration
    : IEntityTypeConfiguration<ShoppingList>
{
    public void Configure(EntityTypeBuilder<ShoppingList> builder)
    {
        builder.HasKey(list => list.Id);

        builder.Property(list => list.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasOne(list => list.User)
            .WithMany()
            .HasForeignKey(list => list.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(list => list.Items)
            .WithOne(item => item.ShoppingList)
            .HasForeignKey(item => item.ShoppingListId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(list => list.UserId);
    }
}