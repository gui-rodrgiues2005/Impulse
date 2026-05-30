using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RenameRecruitIdToCompanyId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SavedTalents_Users_RecruiterId",
                table: "SavedTalents");

            migrationBuilder.RenameColumn(
                name: "RecruiterId",
                table: "SavedTalents",
                newName: "CompanyId");

            migrationBuilder.RenameIndex(
                name: "IX_SavedTalents_RecruiterId",
                table: "SavedTalents",
                newName: "IX_SavedTalents_CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_SavedTalents_Users_CompanyId",
                table: "SavedTalents",
                column: "CompanyId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SavedTalents_Users_CompanyId",
                table: "SavedTalents");

            migrationBuilder.RenameColumn(
                name: "CompanyId",
                table: "SavedTalents",
                newName: "RecruiterId");

            migrationBuilder.RenameIndex(
                name: "IX_SavedTalents_CompanyId",
                table: "SavedTalents",
                newName: "IX_SavedTalents_RecruiterId");

            migrationBuilder.AddForeignKey(
                name: "FK_SavedTalents_Users_RecruiterId",
                table: "SavedTalents",
                column: "RecruiterId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
