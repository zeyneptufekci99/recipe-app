using RecipeApp.Api.Common;

namespace RecipeApp.Api.Models;

public class RecipeStep : BaseEntity
{
    public Guid RecipeId { get; set; }
    public int StepNumber { get; set; }
    public string Description { get; set; } = string.Empty;
    public Recipe Recipe { get; set; } = null!;
}
