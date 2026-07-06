using RecipeApp.Api.DTOs;
using RecipeApp.Api.Models;

namespace RecipeApp.Api.Interfaces;

public interface IAuthService
{
    Task<User?> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto?> LoginAsync(LoginDto dto);
}