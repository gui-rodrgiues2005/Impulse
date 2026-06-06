using backend.Data;
using backend.Dtos;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/trajectory")]
    [ApiController]
    [Authorize]
    public class TrajectoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TrajectoryController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/trajectory — lista trajetórias do usuário logado
        [HttpGet]
        public async Task<IActionResult> GetMyTrajectories()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var trajectories = await _context.Trajectories
                .Where(t => t.UserId == userId.Value)
                .OrderByDescending(t => t.StartDate)
                .Select(t => new TrajectoryResponseDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Type = t.Type,
                    StartDate = t.StartDate,
                    EndDate = t.EndDate,
                    IsOngoing = t.IsOngoing,
                    Description = t.Description,
                    FeedPostId = t.FeedPostId,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();

            return Ok(trajectories);
        }

        // GET /api/trajectory/user/{userId} — lista trajetórias públicas de um estudante
        [AllowAnonymous]
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserTrajectories(Guid userId)
        {
            var trajectories = await _context.Trajectories
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.StartDate)
                .Select(t => new TrajectoryResponseDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Type = t.Type,
                    StartDate = t.StartDate,
                    EndDate = t.EndDate,
                    IsOngoing = t.IsOngoing,
                    Description = t.Description,
                    FeedPostId = t.FeedPostId,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();

            return Ok(trajectories);
        }

        // POST /api/trajectory
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTrajectoryDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var trajectory = new Trajectory
            {
                UserId = userId.Value,
                Title = dto.Title,
                Type = dto.Type,

                StartDate = DateTime.SpecifyKind(
         dto.StartDate,
         DateTimeKind.Utc
     ),

                EndDate = dto.IsOngoing
         ? null
         : dto.EndDate.HasValue
             ? DateTime.SpecifyKind(
                 dto.EndDate.Value,
                 DateTimeKind.Utc
               )
             : null,

                IsOngoing = dto.IsOngoing,
                Description = dto.Description,
                FeedPostId = dto.FeedPostId
            };

            _context.Trajectories.Add(trajectory);
            await _context.SaveChangesAsync();

            return Ok(new TrajectoryResponseDto
            {
                Id = trajectory.Id,
                Title = trajectory.Title,
                Type = trajectory.Type,
                StartDate = trajectory.StartDate,
                EndDate = trajectory.EndDate,
                IsOngoing = trajectory.IsOngoing,
                Description = trajectory.Description,
                FeedPostId = trajectory.FeedPostId,
                CreatedAt = trajectory.CreatedAt
            });
        }

        // PUT /api/trajectory/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTrajectoryDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var trajectory = await _context.Trajectories
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId.Value);

            if (trajectory == null)
                return NotFound(new { message = "Trajetória não encontrada." });

            trajectory.Title = dto.Title;
            trajectory.Type = dto.Type;
            trajectory.StartDate = DateTime.SpecifyKind(
    dto.StartDate,
    DateTimeKind.Utc
);

            trajectory.EndDate = dto.IsOngoing
                ? null
                : dto.EndDate.HasValue
                    ? DateTime.SpecifyKind(
                        dto.EndDate.Value,
                        DateTimeKind.Utc
                      )
                    : null;
            trajectory.IsOngoing = dto.IsOngoing;
            trajectory.Description = dto.Description;

            await _context.SaveChangesAsync();

            return Ok(new TrajectoryResponseDto
            {
                Id = trajectory.Id,
                Title = trajectory.Title,
                Type = trajectory.Type,
                StartDate = trajectory.StartDate,
                EndDate = trajectory.EndDate,
                IsOngoing = trajectory.IsOngoing,
                Description = trajectory.Description,
                FeedPostId = trajectory.FeedPostId,
                CreatedAt = trajectory.CreatedAt
            });
        }

        // DELETE /api/trajectory/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var trajectory = await _context.Trajectories
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId.Value);

            if (trajectory == null)
                return NotFound(new { message = "Trajetória não encontrada." });

            _context.Trajectories.Remove(trajectory);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Trajetória removida." });
        }

        private Guid? GetUserId()
        {
            var raw = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(raw, out var id) ? id : null;
        }
    }
}