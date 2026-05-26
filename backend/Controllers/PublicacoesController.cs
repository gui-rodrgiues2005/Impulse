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
            .Include(x => x.Skills)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new FeedPostResponseDto
            {
                Id = x.Id,

                UserId = x.UserId,

                UserName = x.User.Name,

                UserAvatar = x.User.AvatarUrl,

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
}