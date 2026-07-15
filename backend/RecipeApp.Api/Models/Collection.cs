using System.ComponentModel.DataAnnotations;
using RecipeApp.Api.Common;

namespace RecipeApp.Api.Models;

public class Collection : BaseEntity
{
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public User User { get; set; } = null!;

    public ICollection<CollectionRecipe> CollectionRecipes { get; set; }
        = new List<CollectionRecipe>();
}