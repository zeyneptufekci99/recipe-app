namespace RecipeApp.Api.DTOs;

public class CollectionMembershipDto
{
    public Guid CollectionId { get; set; }

    public string CollectionName { get; set; } = string.Empty;
}