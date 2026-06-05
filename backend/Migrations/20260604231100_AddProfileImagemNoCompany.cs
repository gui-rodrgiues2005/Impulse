using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddProfileImagemNoCompany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LogoUrl",
                table: "Companies",
                newName: "ProfileImage");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId1",
                table: "Companies",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Companies_UserId1",
                table: "Companies",
                column: "UserId1",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Companies_Users_UserId1",
                table: "Companies",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Companies_Users_UserId1",
                table: "Companies");

            migrationBuilder.DropIndex(
                name: "IX_Companies_UserId1",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "Companies");

            migrationBuilder.RenameColumn(
                name: "ProfileImage",
                table: "Companies",
                newName: "LogoUrl");
        }
    }
}
