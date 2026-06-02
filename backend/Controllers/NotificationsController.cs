using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotificationsController(AppDbContext context)
        {
            _context = context;
        }

        // GET - Notificações da empresa logada
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userId, out var userGuid))
                return Unauthorized();

            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == userGuid);

            if (company == null)
                return StatusCode(403, new { message = "Apenas empresas podem ver notificações." });

            var notifications = await _context.Notifications
                .Where(n => n.CompanyId == company.Id)
                .Include(n => n.StudentUser)
                .Include(n => n.Job)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new
                {
                    n.Id,
                    n.Message,
                    n.IsRead,
                    n.CreatedAt,
                    Job = new { n.Job!.Id, n.Job.Title },
                    Student = new { n.StudentUser!.Id, n.StudentUser.Name, n.StudentUser.AvatarUrl }
                })
                .ToListAsync();

            return Ok(notifications);
        }

        // PATCH - Marcar notificação como lida
        [Authorize]
        [HttpPatch("{id}/read")]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userId, out var userGuid))
                return Unauthorized();

            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == userGuid);

            if (company == null)
                return StatusCode(403);

            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id && n.CompanyId == company.Id);

            if (notification == null)
                return NotFound();

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Notificação marcada como lida." });
        }

        // PATCH - Marcar todas como lidas
        [Authorize]
        [HttpPatch("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userId, out var userGuid))
                return Unauthorized();

            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == userGuid);

            if (company == null)
                return StatusCode(403);

            var unread = await _context.Notifications
                .Where(n => n.CompanyId == company.Id && !n.IsRead)
                .ToListAsync();

            unread.ForEach(n => n.IsRead = true);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Todas as notificações marcadas como lidas." });
        }
    }
}