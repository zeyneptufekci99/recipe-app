using RecipeApp.Api.Common;
using RecipeApp.Api.Models.Enums;

namespace RecipeApp.Api.Models;

public class Recipe : BaseEntity
{
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public int PrepTime { get; set; }
    public int CookTime { get; set; }
    public int Servings { get; set; }
    public Difficulty Difficulty { get; set; } = Difficulty.Easy;
    public Guid CategoryId { get; set; }
    public SourceType SourceType { get; set; } = SourceType.Manual;
    public string? SourceUrl { get; set; }
    public bool IsFavorite { get; set; } = false;
    public User User { get; set; } = null!;
    public Category Category { get; set; } = null!;
    public ICollection<Ingredient> Ingredients { get; set; } = new List<Ingredient>();
    public ICollection<RecipeStep> Steps { get; set; } = new List<RecipeStep>();
}