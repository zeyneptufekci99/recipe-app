namespace RecipeApp.Api.Models;
using RecipeApp.Api.Common;

public class CollectionRecipe
{
    public Guid CollectionId { get; set; }

    public Guid RecipeId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Collection Collection { get; set; } = null!;

    public Recipe Recipe { get; set; } = null!;
}