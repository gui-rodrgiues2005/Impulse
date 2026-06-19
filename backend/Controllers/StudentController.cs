using backend.Data;
using backend.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentController(
            AppDbContext context
        )
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var student = await _context.StudentProfiles
                .Include(s => s.User)
                .ThenInclude(u => u.Skills)
                .FirstOrDefaultAsync(s => s.UserId.ToString() == userId);

            if (student == null)
                return NotFound();

            return Ok(new
            {
                student.Id,
                student.UserId,
                student.Bio,
                student.Course,
                student.ProfileImage,
                student.Linkedin,
                student.Github,
                student.University,
                student.Location,
                student.ResumoUrl,
                Skills = student.User.Skills.Select(s => s.Name).ToList()
            });
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateStudentDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var student = await _context.StudentProfiles
                .Include(s => s.User)
                .ThenInclude(u => u.Skills)
                .FirstOrDefaultAsync(s => s.UserId.ToString() == userId);

            if (student == null)
                return NotFound(new { message = "Perfil não encontrado." });

            student.Bio = dto.Bio;
            student.Course = dto.Course;
            student.ProfileImage = dto.ProfileImage;
            student.Linkedin = dto.Linkedin;
            student.Github = dto.Github;
            student.University = dto.University;
            student.Location = dto.Location;

            // <- essas linhas estavam faltando:
            student.User.Skills.Clear();
            foreach (var skillName in dto.Skills)
            {
                student.User.Skills.Add(new Skill { Name = skillName });
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                student.Id,
                student.Bio,
                student.Course,
                student.ProfileImage,
                student.Linkedin,
                student.Github,
                student.University,
                student.Location,
                Name = student.User.Name,
                Skills = student.User.Skills.Select(s => s.Name).ToList()
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudent(Guid id)
        {
            var student = await _context.StudentProfiles
                .Include(s => s.User)
                .ThenInclude(u => u.Skills)
                .FirstOrDefaultAsync(s => s.UserId == id);

            if (student == null)
                return NotFound(new { message = "Estudante não encontrado." });

            return Ok(new
            {
                student.Id,
                student.UserId,
                Name = student.User.Name, // ← adicionado
                student.Bio,
                student.ProfileImage,
                student.Course,
                student.Linkedin,
                student.Github,
                student.University,
                student.Location,
                student.ResumoUrl,
                Skills = student.User.Skills.Select(s => s.Name).ToList()
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(Guid id, [FromBody] UpdateStudentDto dto)
        {
            var student = await _context.StudentProfiles
                .Include(s => s.User)
                .ThenInclude(u => u.Skills)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (student == null)
            {
                return NotFound(new
                {
                    message = "Estudante não encontrado."
                });
            }

            student.Bio = dto.Bio;
            student.ProfileImage = dto.ProfileImage;
            student.Course = dto.Course;
            student.Linkedin = dto.Linkedin;
            student.Github = dto.Github;
            student.University = dto.University;
            student.Location = dto.Location;
            student.User.Skills.Clear();

            foreach (var skillName in dto.Skills)
            {
                student.User.Skills.Add(new Skill
                {
                    Name = skillName
                });
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                student.Id,
                student.Bio,
                student.ProfileImage,
                student.Course,
                student.Linkedin,
                student.Github,
                student.University,
                student.Location,

                Skills = student.User.Skills
             .Select(s => s.Name)
             .ToList()
            });
        }


    }
}
