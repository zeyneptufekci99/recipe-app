using FluentValidation;
using RecipeApp.Api.DTOs;

namespace RecipeApp.Api.Validators;

public class UpdateRecipeDtoValidator : AbstractValidator<UpdateRecipeDto>
{
    public UpdateRecipeDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Tarif adı zorunludur.")
            .MaximumLength(150).WithMessage("Tarif adı en fazla 150 karakter olabilir.");

        RuleFor(x => x.PrepTime)
            .GreaterThanOrEqualTo(0).WithMessage("Hazırlık süresi negatif olamaz.");

        RuleFor(x => x.CookTime)
            .GreaterThanOrEqualTo(0).WithMessage("Pişirme süresi negatif olamaz.");

        RuleFor(x => x.Servings)
            .GreaterThan(0).WithMessage("Porsiyon sayısı 0'dan büyük olmalıdır.");

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("Kategori seçilmelidir.");

        RuleFor(x => x.Ingredients)
            .NotEmpty().WithMessage("En az bir malzeme eklenmelidir.");

        RuleForEach(x => x.Ingredients).ChildRules(ingredient =>
        {
            ingredient.RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Malzeme adı zorunludur.");
        });

        RuleFor(x => x.Steps)
            .NotEmpty().WithMessage("En az bir yapılış adımı eklenmelidir.");

        RuleForEach(x => x.Steps).ChildRules(step =>
        {
            step.RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Adım açıklaması zorunludur.");

            step.RuleFor(x => x.StepNumber)
                .GreaterThan(0).WithMessage("Adım numarası 0'dan büyük olmalıdır.");
        });
    }
}