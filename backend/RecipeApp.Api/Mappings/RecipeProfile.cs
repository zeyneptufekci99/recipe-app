using AutoMapper;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Models;

namespace RecipeApp.Api.Mappings;

public class RecipeProfile : Profile
{
    public RecipeProfile()
    {
        CreateMap<Recipe, RecipeResponseDto>()
            .ForMember(dest => dest.Category,
                opt => opt.MapFrom(src => src.Category.Name));

        CreateMap<Recipe, RecipeDetailDto>()
            .ForMember(dest => dest.Category,
                opt => opt.MapFrom(src => src.Category.Name))
            .ForMember(dest => dest.Steps,
                opt => opt.MapFrom(src => src.Steps.OrderBy(s => s.StepNumber)));

        CreateMap<Ingredient, IngredientResponseDto>();
        CreateMap<RecipeStep, RecipeStepResponseDto>();

        CreateMap<CreateRecipeDto, Recipe>();
        CreateMap<CreateIngredientDto, Ingredient>();
        CreateMap<CreateRecipeStepDto, RecipeStep>();

        CreateMap<UpdateRecipeDto, Recipe>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Ingredients, opt => opt.Ignore())
            .ForMember(dest => dest.Steps, opt => opt.Ignore())
            .ForMember(dest => dest.Category, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore());
    }
}