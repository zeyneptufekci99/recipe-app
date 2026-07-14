using RecipeApp.Api.Models.Enums;
using RecipeApp.Api.Common;

namespace RecipeApp.Api.Models;

public class MealPlanItem : BaseEntity
{
    public Guid UserId { get; set; }

    public Guid RecipeId { get; set; }

    public DateOnly Date { get; set; }

    public MealType MealType { get; set; }

    public User User { get; set; } = null!;

    public Recipe Recipe { get; set; } = null!;
}