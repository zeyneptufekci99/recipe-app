using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecipeApp.Api.Models;


namespace RecipeApp.Api.Data.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(c => c.Name)
            .IsUnique();

        builder.HasMany(c => c.Recipes)
            .WithOne(r => r.Category)
            .HasForeignKey(c => c.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);


        builder.HasData(
            new Category { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "Kahvaltı" },
            new Category { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "Çorba" },
            new Category { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Ana Yemek" },
            new Category { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Name = "Tatlı" },
            new Category { Id = Guid.Parse("55555555-5555-5555-5555-555555555555"), Name = "Atıştırmalık" },
            new Category { Id = Guid.Parse("66666666-6666-6666-6666-666666666666"), Name = "İçecek" },
            new Category { Id = Guid.Parse("77777777-7777-7777-7777-777777777777"), Name = "Salata" }
        );

    }

   
}
