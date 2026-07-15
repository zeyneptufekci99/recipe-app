using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecipeApp.Api.Models;

namespace RecipeApp.Api.Data.Configurations;

public class CollectionRecipeConfiguration
    : IEntityTypeConfiguration<CollectionRecipe>
{
    public void Configure(
        EntityTypeBuilder<CollectionRecipe> builder)
    {
        builder.HasKey(collectionRecipe => new
        {
            collectionRecipe.CollectionId,
            collectionRecipe.RecipeId
        });

        builder.Property(collectionRecipe =>
                collectionRecipe.CreatedAt)
            .IsRequired();

        builder.HasOne(collectionRecipe =>
                collectionRecipe.Collection)
            .WithMany(collection =>
                collection.CollectionRecipes)
            .HasForeignKey(collectionRecipe =>
                collectionRecipe.CollectionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(collectionRecipe =>
                collectionRecipe.Recipe)
            .WithMany()
            .HasForeignKey(collectionRecipe =>
                collectionRecipe.RecipeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(collectionRecipe =>
            collectionRecipe.RecipeId);
    }
}