using API.DTOs.Feed;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers;

[ApiController]
[Route("api/publicacoes")]
public class PublicacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public PublicacoesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<FeedPostResponseDto>>> GetFeed()
    {
        var posts = await _context.FeedPosts
            .Include(x => x.User)
                .ThenInclude(u => u.StudentProfile)
            .Include(x => x.User)
                .ThenInclude(u => u.CompanyProfile)
            .Include(x => x.Skills)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new FeedPostResponseDto
            {
                Id = x.Id,
                UserId = x.UserId,
                UserName = x.User.Name,
                UserAvatar =
                    x.User.CompanyProfile != null
                        ? x.User.CompanyProfile.ProfileImage
                        : x.User.StudentProfile != null
                            ? x.User.StudentProfile.ProfileImage
                            : null,
                UserRole = x.User.Role.ToString(),
                Title = x.Title,
                Description = x.Description,
                ActivityType = x.ActivityType,
                Level = x.Level,
                Link = x.Link,
                MediaUrl = x.MediaUrl,
                Visibility = x.Visibility,
                CreatedAt = x.CreatedAt,
                Skills = x.Skills
                    .Select(skill => skill.Name)
                    .ToList()
            })
            .ToListAsync();

        return Ok(posts);
    }
    [Authorize]
    [HttpGet("my-posts")]
    public async Task<ActionResult<List<FeedPostResponseDto>>> GetMyPosts()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var posts = await _context.FeedPosts
            .Include(x => x.User)
                .ThenInclude(u => u.StudentProfile)
            .Include(x => x.User)
                .ThenInclude(u => u.CompanyProfile)
            .Include(x => x.Skills)
            .Where(x => x.UserId.ToString() == userId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new FeedPostResponseDto
            {
                Id = x.Id,
                UserId = x.UserId,
                UserName = x.User.Name,
                UserAvatar =
                    x.User.CompanyProfile != null
                        ? x.User.CompanyProfile.ProfileImage
                        : x.User.StudentProfile != null
                            ? x.User.StudentProfile.ProfileImage
                            : null,

                UserRole = x.User.Role.ToString(),
                Title = x.Title,
                Description = x.Description,
                ActivityType = x.ActivityType,
                Level = x.Level,
                Link = x.Link,
                MediaUrl = x.MediaUrl,
                Visibility = x.Visibility,
                CreatedAt = x.CreatedAt,
                Skills = x.Skills
                    .Select(skill => skill.Name)
                    .ToList()
            })
            .ToListAsync();

        return Ok(posts);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<FeedPostResponseDto>> CreatePost(
     [FromBody] CreateFeedPostDto dto
 )
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userId, out var parsedUserId))
        {
            return BadRequest(new { message = "ID de usuário inválido" });
        }

        var user = await _context.Users
            .Include(x => x.StudentProfile)
            .Include(x => x.CompanyProfile)
            .FirstOrDefaultAsync(u => u.Id == parsedUserId);

        if (user == null)
        {
            return NotFound(new { message = "Usuário não encontrado" });
        }

        var post = new FeedPost
        {
            UserId = parsedUserId,
            Title = dto.Title,
            Description = dto.Description,
            ActivityType = dto.ActivityType,
            Level = dto.Level,
            Link = dto.Link ?? "",
            MediaUrl = dto.MediaUrl,
            Visibility = dto.Visibility ?? "Publico"
        };

        _context.FeedPosts.Add(post);
        await _context.SaveChangesAsync();

        return Ok(new FeedPostResponseDto
        {
            Id = post.Id,
            UserId = post.UserId,
            UserName = user.Name,
            UserAvatar =
                user.CompanyProfile != null
                    ? user.CompanyProfile.ProfileImage
                    : user.StudentProfile != null
                        ? user.StudentProfile.ProfileImage
                        : null,
            UserRole = user.Role.ToString(),
            Title = post.Title,
            Description = post.Description,
            ActivityType = post.ActivityType,
            Level = post.Level,
            Link = post.Link,
            MediaUrl = post.MediaUrl,
            Visibility = post.Visibility,
            CreatedAt = post.CreatedAt,
            Skills = []
        });
    }
}