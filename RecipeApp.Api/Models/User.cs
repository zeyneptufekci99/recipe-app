using RecipeApp.Api.Common;
namespace RecipeApp.Api.Models;

public class User : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public ICollection<Recipe> Recipes { get; set; }= new List<Recipe>();
}
