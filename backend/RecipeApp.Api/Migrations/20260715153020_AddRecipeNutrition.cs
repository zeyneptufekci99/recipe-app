using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecipeApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRecipeNutrition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CaloriesPerServing",
                table: "Recipes",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CarbohydrateGramsPerServing",
                table: "Recipes",
                type: "numeric(8,2)",
                precision: 8,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "FatGramsPerServing",
                table: "Recipes",
                type: "numeric(8,2)",
                precision: 8,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NutritionEstimatedAt",
                table: "Recipes",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ProteinGramsPerServing",
                table: "Recipes",
                type: "numeric(8,2)",
                precision: 8,
                scale: 2,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 15, 15, 30, 19, 841, DateTimeKind.Utc).AddTicks(8428));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 15, 15, 30, 19, 841, DateTimeKind.Utc).AddTicks(8442));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 15, 15, 30, 19, 841, DateTimeKind.Utc).AddTicks(8444));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 15, 15, 30, 19, 841, DateTimeKind.Utc).AddTicks(8446));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 15, 15, 30, 19, 841, DateTimeKind.Utc).AddTicks(8448));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 15, 15, 30, 19, 841, DateTimeKind.Utc).AddTicks(8449));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 15, 15, 30, 19, 841, DateTimeKind.Utc).AddTicks(8451));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CaloriesPerServing",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "CarbohydrateGramsPerServing",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "FatGramsPerServing",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "NutritionEstimatedAt",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "ProteinGramsPerServing",
                table: "Recipes");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 13, 17, 10, 20, 734, DateTimeKind.Utc).AddTicks(7060));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 13, 17, 10, 20, 734, DateTimeKind.Utc).AddTicks(7073));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 13, 17, 10, 20, 734, DateTimeKind.Utc).AddTicks(7075));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 13, 17, 10, 20, 734, DateTimeKind.Utc).AddTicks(7077));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 13, 17, 10, 20, 734, DateTimeKind.Utc).AddTicks(7079));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 13, 17, 10, 20, 734, DateTimeKind.Utc).AddTicks(7081));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"),
                column: "CreatedAt",
                value: new DateTime(2026, 7, 13, 17, 10, 20, 734, DateTimeKind.Utc).AddTicks(7083));
        }
    }
}
