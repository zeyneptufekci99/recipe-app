using RecipeApp.Api.Models;

namespace RecipeApp.Api.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}