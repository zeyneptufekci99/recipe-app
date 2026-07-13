using System.ComponentModel.DataAnnotations;
using RecipeApp.Api.Common;

namespace RecipeApp.Api.Models;

public class ShoppingList : BaseEntity
{
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public User User { get; set; } = null!;

    public ICollection<ShoppingListItem> Items { get; set; }
        = new List<ShoppingListItem>();
}