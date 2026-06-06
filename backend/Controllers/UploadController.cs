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
        public async Task<IActionResult> Upload( IFormFile file, [FromServices] CloudinaryService cloudinary)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Arquivo não enviado.");
            }

            var url = await cloudinary.UploadImageAsync(file);
            return Ok(new { url });
        }
    }
}