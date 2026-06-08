using API.DTOs.Feed;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers;

[ApiController]
[Route("api/publicacoes/{postId}")]
[Authorize]
public class FeedInteractionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public FeedInteractionsController(AppDbContext context)
    {
        _context = context;
    }

    // ── CURTIDAS ──────────────────────────────────────────

    [HttpPost("curtir")]
    public async Task<IActionResult> Like(Guid postId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var parsedUserId = Guid.Parse(userId);

        var postExists = await _context.FeedPosts.AnyAsync(x => x.Id == postId);
        if (!postExists)
            return NotFound(new { message = "Post não encontrado." });

        var alreadyLiked = await _context.FeedLikes
            .AnyAsync(x => x.PostId == postId && x.UserId == parsedUserId);

        if (alreadyLiked)
            return Conflict(new { message = "Você já curtiu esta publicação." });

        var like = new FeedLike
        {
            PostId = postId,
            UserId = parsedUserId
        };

        _context.FeedLikes.Add(like);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Publicação curtida." });
    }

    [HttpDelete("curtir")]
    public async Task<IActionResult> Unlike(Guid postId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var parsedUserId = Guid.Parse(userId);

        var like = await _context.FeedLikes
            .FirstOrDefaultAsync(x =>
                x.PostId == postId &&
                x.UserId == parsedUserId
            );

        if (like == null)
            return NotFound(new { message = "Curtida não encontrada." });

        _context.FeedLikes.Remove(like);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Curtida removida." });
    }

    // ── COMENTÁRIOS ───────────────────────────────────────

    [HttpGet("comentarios")]
    public async Task<ActionResult<List<CommentResponseDto>>> GetComments(Guid postId)
    {
        var postExists = await _context.FeedPosts.AnyAsync(x => x.Id == postId);
        if (!postExists)
            return NotFound(new { message = "Post não encontrado." });

        var comments = await _context.FeedComments
            .Where(x => x.PostId == postId)
            .Include(x => x.User)
                .ThenInclude(u => u.StudentProfile)
            .Include(x => x.User)
                .ThenInclude(u => u.CompanyProfile)
            .OrderBy(x => x.CreatedAt)
            .Select(x => new CommentResponseDto
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
                Content = x.Content,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();

        return Ok(comments);
    }

    [HttpPost("comentarios")]
    public async Task<ActionResult<CommentResponseDto>> AddComment(
        Guid postId,
        [FromBody] CreateCommentDto dto
    )
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(dto.Content))
            return BadRequest(new { message = "O comentário não pode estar vazio." });

        var parsedUserId = Guid.Parse(userId);

        // Busca o post com a permissão de comentário
        var post = await _context.FeedPosts
            .FirstOrDefaultAsync(x => x.Id == postId);

        if (post == null)
            return NotFound(new { message = "Post não encontrado." });

        // ── Valida permissão de comentário ────────────────
        if (post.CommentPermission == "Ninguem")
            return StatusCode(403, new { message = "Comentários desativados nesta publicação." });

        if (post.CommentPermission == "ApenasEmpresas")
        {
            var commenter = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == parsedUserId);

            if (commenter == null || commenter.Role.ToString() != "Company")
                return StatusCode(403, new { message = "Apenas empresas podem comentar nesta publicação." });
        }
        // ─────────────────────────────────────────────────

        var user = await _context.Users
            .Include(u => u.StudentProfile)
            .Include(u => u.CompanyProfile)
            .FirstOrDefaultAsync(u => u.Id == parsedUserId);

        if (user == null)
            return NotFound(new { message = "Usuário não encontrado." });

        var comment = new FeedComment
        {
            PostId = postId,
            UserId = parsedUserId,
            Content = dto.Content.Trim()
        };

        _context.FeedComments.Add(comment);
        await _context.SaveChangesAsync();

        return Ok(new CommentResponseDto
        {
            Id = comment.Id,
            UserId = comment.UserId,
            UserName = user.Name,
            UserAvatar =
                user.CompanyProfile != null
                    ? user.CompanyProfile.ProfileImage
                    : user.StudentProfile != null
                        ? user.StudentProfile.ProfileImage
                        : null,
            UserRole = user.Role.ToString(),
            Content = comment.Content,
            CreatedAt = comment.CreatedAt
        });
    }
}