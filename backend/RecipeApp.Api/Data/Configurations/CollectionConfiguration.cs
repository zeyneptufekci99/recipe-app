using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecipeApp.Api.Models;

namespace RecipeApp.Api.Data.Configurations;

public class CollectionConfiguration
    : IEntityTypeConfiguration<Collection>
{
    public void Configure(EntityTypeBuilder<Collection> builder)
    {
        builder.HasKey(collection => collection.Id);

        builder.Property(collection => collection.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(collection => collection.Description)
            .HasMaxLength(500);

        builder.HasOne(collection => collection.User)
            .WithMany()
            .HasForeignKey(collection => collection.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(collection => collection.CollectionRecipes)
            .WithOne(collectionRecipe => collectionRecipe.Collection)
            .HasForeignKey(collectionRecipe =>
                collectionRecipe.CollectionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(collection => collection.UserId);

        builder.HasIndex(collection => new
        {
            collection.UserId,
            collection.Name
        });

        builder.HasOne(collection => collection.User)
    .WithMany(user => user.Collections);
    }
}