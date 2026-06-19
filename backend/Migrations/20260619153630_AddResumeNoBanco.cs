using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddResumeNoBanco : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "ResumoArquivo",
                table: "StudentProfiles",
                type: "bytea",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResumoContentType",
                table: "StudentProfiles",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResumoArquivo",
                table: "StudentProfiles");

            migrationBuilder.DropColumn(
                name: "ResumoContentType",
                table: "StudentProfiles");
        }
    }
}
