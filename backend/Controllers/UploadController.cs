using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UpdateController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UpdateController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file, [FromServices] CloudinaryService cloudinary)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Arquivo não enviado.");
            }

            var url = await cloudinary.UploadImageAsync(file);
            return Ok(new { url });
        }
        // Upload do currículo (só o próprio estudante)
        [Authorize]
        [HttpPost("resume")]
        public async Task<IActionResult> UploadResume(
            IFormFile file,
            [FromServices] CloudinaryService cloudinary)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var student = await _context.StudentProfiles
                .FirstOrDefaultAsync(s => s.UserId.ToString() == userId);

            if (student == null) return NotFound();

            // Reutiliza o mesmo Cloudinary mas salva como raw (PDF)
            await using var stream = file.OpenReadStream();
            var uploadParams = new CloudinaryDotNet.Actions.RawUploadParams
            {
                File = new CloudinaryDotNet.FileDescription(file.FileName, stream),
                Folder = "impulse/resumes"
            };

            var cloudinaryInstance = cloudinary.GetCloudinary(); // veja passo 3
            var result = await cloudinaryInstance.UploadAsync(uploadParams);

            student.ResumoUrl = result.SecureUrl.ToString();
            await _context.SaveChangesAsync();

            return Ok(new { url = student.ResumoUrl });
        }

        // GET currículo — só empresas acessam
        [Authorize]
        [HttpGet("{studentId}/resume")]
        public async Task<IActionResult> GetResume(Guid studentId)
        {
            // Verifica se quem pede é uma empresa
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (role != "Company")
                return Forbid();

            var student = await _context.StudentProfiles
                .FirstOrDefaultAsync(s => s.UserId == studentId);

            if (student == null) return NotFound();
            if (string.IsNullOrEmpty(student.ResumoUrl))
                return NotFound(new { message = "Estudante não possui currículo." });

            return Ok(new { url = student.ResumoUrl });
        }
    }
}