using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id.ToString() == userId);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                user.Id,
                user.Name,
                user.Email,
                Role = user.Role.ToString().ToLower()
            });
        }

        [Authorize]
        [HttpGet("invites")]
        public async Task<IActionResult> GetInvites()
        {
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            var invites = await _context
                .RecruiterInvites

                .Include(i => i.Company)

                .Where(i =>
                    i.UserId.ToString() == userId &&
                    !i.Accepted
                )

                .Select(i => new
                {
                    i.Id,

                    i.Position,

                    company = new
                    {
                        i.Company.Id,
                        i.Company.Name,
                        i.Company.LogoUrl
                    }
                })

                .ToListAsync();

            return Ok(invites);
        }

        [Authorize]
        [HttpPost("accept-invite/{inviteId}")]
        public async Task<IActionResult> AcceptInvite(
    Guid inviteId
)
        {
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            var invite = await _context
                .RecruiterInvites

                .FirstOrDefaultAsync(i =>
                    i.Id == inviteId &&
                    i.UserId.ToString() == userId
                );

            if (invite == null)
            {
                return NotFound(new { message = "Convite não encontrado." });
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.Id.ToString() == userId
                );

            if (user == null)
            {
                return NotFound(new { message = "Usuário não encontrado." });
            }

            user.Role = UserRole.Recruiter;

            var recruiterProfile =
                new RecruiterProfile
                {
                    UserId = user.Id,
                    CompanyId = invite.CompanyId,
                    Position = invite.Position
                };

            invite.Accepted = true;

            _context.RecruiterProfiles
                .Add(recruiterProfile);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message =
                    "Convite aceito com sucesso."
            });
        }
    }
}