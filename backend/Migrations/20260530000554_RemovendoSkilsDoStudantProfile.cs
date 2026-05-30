using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RemovendoSkilsDoStudantProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_StudentProfiles_StudentProfileId",
                table: "Activities");

            migrationBuilder.DropIndex(
                name: "IX_Activities_StudentProfileId",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "Skills",
                table: "StudentProfiles");

            migrationBuilder.DropColumn(
                name: "StudentProfileId",
                table: "Activities");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Skills",
                table: "StudentProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "StudentProfileId",
                table: "Activities",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Activities_StudentProfileId",
                table: "Activities",
                column: "StudentProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_StudentProfiles_StudentProfileId",
                table: "Activities",
                column: "StudentProfileId",
                principalTable: "StudentProfiles",
                principalColumn: "Id");
        }
    }
}
