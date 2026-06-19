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

        [Authorize]
        [HttpPost("resume")]
        public async Task<IActionResult> UploadResume(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Arquivo não enviado.");

            if (file.ContentType != "application/pdf")
                return BadRequest("Apenas arquivos PDF são permitidos.");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var student = await _context.StudentProfiles
                .FirstOrDefaultAsync(s => s.UserId.ToString() == userId);

            if (student == null) return NotFound();

            // Converte o arquivo recebido da requisição para um array de bytes
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);

            student.ResumoArquivo = memoryStream.ToArray();
            student.ResumoContentType = file.ContentType;

            // Opcional: define uma URL interna fictícia caso seu front antigo ainda precise ler a string
            student.ResumoUrl = $"/api/students/{student.UserId}/resume";

            await _context.SaveChangesAsync();

            return Ok(new { message = "Currículo salvo com sucesso no banco de dados." });
        }

        // GET currículo — Aberto para Empresas e para o próprio Estudante visualizar
        [AllowAnonymous]
        [HttpGet("{studentId}/resume")]
        public async Task<IActionResult> GetResume(Guid studentId)
        {
            var student = await _context.StudentProfiles
                .FirstOrDefaultAsync(s => s.UserId == studentId);

            if (student == null) return NotFound();
            if (student.ResumoArquivo == null || student.ResumoArquivo.Length == 0)
                return NotFound(new { message = "Estudante não possui currículo cadastrado." });

            // Retorna o arquivo binário diretamente com o tipo correto ("application/pdf")
            // Isso força o navegador a exibir o PDF no iframe ao invés de tentar baixá-lo
            return File(student.ResumoArquivo, student.ResumoContentType ?? "application/pdf");
        }
    }
}