using RecipeApp.Api.Models;

namespace RecipeApp.Api.Interfaces;

public interface ICategoryService
{
    Task<List<Category>> GetAllAsync();
}