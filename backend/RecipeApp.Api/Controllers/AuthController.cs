using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeApp.Api.Data;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Interfaces;
using RecipeApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace RecipeApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController: ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var user = await _authService.RegisterAsync(dto);

        if (user == null)
            return BadRequest("Bu email zaten kayıtlı.");

        return Ok(new
        {
            user.Id,
            user.Name,
            user.Email
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {

        var response = await _authService.LoginAsync(dto);
        if(response == null)
        {
            return BadRequest("Email veya şifre hatalı");
        }

        return Ok(response);
    
    }
    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var name = User.FindFirst(ClaimTypes.Name)?.Value;
        var email = User.FindFirst(ClaimTypes.Email)?.Value;

        return Ok(new
        {
            userId,
            name,
            email
        });
    }
}
