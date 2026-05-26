using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddFeedESkills : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Skill_Talents_TalentId",
                table: "Skill");

            migrationBuilder.DropForeignKey(
                name: "FK_Skill_Users_UserId",
                table: "Skill");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Skill",
                table: "Skill");

            migrationBuilder.RenameTable(
                name: "Skill",
                newName: "Skills");

            migrationBuilder.RenameIndex(
                name: "IX_Skill_UserId",
                table: "Skills",
                newName: "IX_Skills_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Skill_TalentId",
                table: "Skills",
                newName: "IX_Skills_TalentId");

            migrationBuilder.AddColumn<Guid>(
                name: "FeedPostId",
                table: "Skills",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Skills",
                table: "Skills",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "FeedPosts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    ActivityType = table.Column<string>(type: "text", nullable: false),
                    Level = table.Column<string>(type: "text", nullable: false),
                    Link = table.Column<string>(type: "text", nullable: false),
                    Visibility = table.Column<string>(type: "text", nullable: false),
                    MediaUrl = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeedPosts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FeedPosts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Skills_FeedPostId",
                table: "Skills",
                column: "FeedPostId");

            migrationBuilder.CreateIndex(
                name: "IX_FeedPosts_UserId",
                table: "FeedPosts",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Skills_FeedPosts_FeedPostId",
                table: "Skills",
                column: "FeedPostId",
                principalTable: "FeedPosts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Skills_Talents_TalentId",
                table: "Skills",
                column: "TalentId",
                principalTable: "Talents",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Skills_Users_UserId",
                table: "Skills",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Skills_FeedPosts_FeedPostId",
                table: "Skills");

            migrationBuilder.DropForeignKey(
                name: "FK_Skills_Talents_TalentId",
                table: "Skills");

            migrationBuilder.DropForeignKey(
                name: "FK_Skills_Users_UserId",
                table: "Skills");

            migrationBuilder.DropTable(
                name: "FeedPosts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Skills",
                table: "Skills");

            migrationBuilder.DropIndex(
                name: "IX_Skills_FeedPostId",
                table: "Skills");

            migrationBuilder.DropColumn(
                name: "FeedPostId",
                table: "Skills");

            migrationBuilder.RenameTable(
                name: "Skills",
                newName: "Skill");

            migrationBuilder.RenameIndex(
                name: "IX_Skills_UserId",
                table: "Skill",
                newName: "IX_Skill_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Skills_TalentId",
                table: "Skill",
                newName: "IX_Skill_TalentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Skill",
                table: "Skill",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Skill_Talents_TalentId",
                table: "Skill",
                column: "TalentId",
                principalTable: "Talents",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Skill_Users_UserId",
                table: "Skill",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
