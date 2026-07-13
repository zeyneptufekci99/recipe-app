using System.ComponentModel.DataAnnotations;
using RecipeApp.Api.Common;

namespace RecipeApp.Api.Models;

public class ShoppingListItem : BaseEntity
{
    public Guid ShoppingListId { get; set; }

    public Guid? RecipeId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Amount { get; set; }

    public bool IsCompleted { get; set; }

    public ShoppingList ShoppingList { get; set; } = null!;

    public Recipe? Recipe { get; set; }
}