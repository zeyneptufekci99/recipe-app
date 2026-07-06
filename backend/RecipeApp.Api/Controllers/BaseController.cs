using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace RecipeApp.Api.Controllers;

[ApiController]
public abstract class BaseController : ControllerBase
{
    protected Guid CurrentUserId
    {
        get
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
                throw new UnauthorizedAccessException("User id not found.");

            return Guid.Parse(userId);
        }
    }
}