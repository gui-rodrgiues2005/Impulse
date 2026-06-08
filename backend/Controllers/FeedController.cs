using API.DTOs.Feed;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers;

[ApiController]
[Route("api/feed")]
public class FeedController : ControllerBase
{
    private readonly AppDbContext _context;

    public FeedController(AppDbContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpPost("publish")]
    public async Task<IActionResult> PublishActivity(
        [FromBody] CreateFeedPostDto dto
    )
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized("Usuário não autenticado.");

        var user = await _context.Users
            .Include(x => x.Skills)
            .FirstOrDefaultAsync(x => x.Id == Guid.Parse(userId));

        if (user == null)
            return NotFound("Usuário não encontrado.");

        var post = new FeedPost
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Title = dto.Title,
            Description = dto.Description,
            ActivityType = dto.ActivityType,
            Level = dto.Level,
            Link = dto.Link,
            Visibility = dto.Visibility,
            MediaUrl = dto.MediaUrl,
            CommentPermission = dto.CommentPermission ?? "Todos", // ← novo
            CreatedAt = DateTime.UtcNow
        };

        if (dto.SkillIds != null && dto.SkillIds.Any())
        {
            var skills = await _context.Skills
                .Where(x => dto.SkillIds.Contains(x.Id))
                .ToListAsync();

            post.Skills = skills;
        }

        _context.FeedPosts.Add(post);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Atividade publicada com sucesso." });
    }

    [Authorize]
    [HttpDelete("{postId}")]
    public async Task<IActionResult> DeletePost(Guid postId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var post = await _context.FeedPosts
            .FirstOrDefaultAsync(x =>
                x.Id == postId &&
                x.UserId == Guid.Parse(userId)
            );

        if (post == null)
            return NotFound("Post não encontrado.");

        _context.FeedPosts.Remove(post);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Post removido com sucesso." });
    }
}