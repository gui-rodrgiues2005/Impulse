using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public LoginController(
            AppDbContext context,
            IConfiguration config
        )
        {
            _context = context;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(
            [FromBody] LoginDto user
        )
        {
            var existingUser = await _context.Users
                .Include(u => u.StudentProfile)
                .FirstOrDefaultAsync(u => u.Email == user.Email);

            if (existingUser == null)
            {
                return NotFound(new { message = "Usuário não encontrado." });
            }

            bool isPasswordValid =
                BCrypt.Net.BCrypt.Verify(
                    user.Password,
                    existingUser.PasswordHash
                );

            if (!isPasswordValid)
            {
                return Unauthorized(new { message = "Senha incorreta." });
            }

            var jwtKey = _config["Jwt:Key"];
            var key = Encoding.ASCII.GetBytes(jwtKey);

            var claims = new[]
            {
                new Claim(
                    ClaimTypes.NameIdentifier,
                    existingUser.Id.ToString()
                ),

                new Claim(
                    ClaimTypes.Name,
                    existingUser.Name
                ),

                new Claim(
                    ClaimTypes.Role,
                    existingUser.Role.ToString()
                )
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(2),
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            Guid? companyId = null;

            // 🔥 BUSCA COMPANY CORRETA (novo modelo)
            if (existingUser.Role == UserRole.Company)
            {
                companyId = await _context.Companies
                    .Where(c => c.UserId == existingUser.Id)
                    .Select(c => c.Id)
                    .FirstOrDefaultAsync();
            }

            return Ok(new
            {
                token = tokenHandler.WriteToken(token),

                user = new
                {
                    id = existingUser.Id,
                    name = existingUser.Name,
                    email = existingUser.Email,
                    role = existingUser.Role.ToString().ToLower(),

                    companyId = companyId,

                    hasStudentProfile =
                        existingUser.StudentProfile != null
                }
            });
        }
    }
}