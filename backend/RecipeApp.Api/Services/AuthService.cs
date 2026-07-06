using Microsoft.EntityFrameworkCore;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Data;
using RecipeApp.Api.Interfaces;
using RecipeApp.Api.Models;

namespace RecipeApp.Api.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IJwtService _jwtService;
    public AuthService(AppDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }


    public async Task<User?> RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _context.Users.FirstOrDefaultAsync(x => x.Email == dto.Email);
        if (existingUser != null)
        {
            return null;
        }

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
        {
            return null;
        }
        var isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!isPasswordValid)
            return null;

        var token = _jwtService.GenerateToken(user);

        return new AuthResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Token = token
        };

       
    }
}

