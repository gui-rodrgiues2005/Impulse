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

        // =========================================
        // BUSCA PERFIS (ALUNOS E EMPRESAS)
        // =========================================
        [Authorize]
        [HttpGet("search")]
        public async Task<IActionResult> SearchProfiles([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q) || q.Length < 2)
                return Ok(new { students = new List<object>(), companies = new List<object>() });

            var searchTerm = q.ToLower();

            var students = await _context.Users
                .Where(u => u.Role == UserRole.Student &&
                        EF.Functions.ILike(u.Name, $"%{q}%"))
                .Take(5)
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.AvatarUrl,
                    role = "Student"
                })
                .ToListAsync();

            var companies = await _context.Users
                .Where(u => u.Role == UserRole.Company &&
                            u.Name.ToLower().Contains(searchTerm))
                .Take(5)
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.AvatarUrl,
                    role = "Company"
                })
                .ToListAsync();

            return Ok(new { students, companies });
        }
    }
}