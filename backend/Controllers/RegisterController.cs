using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        public RegisterController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] UserDto user)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == user.Email);

            if (existingUser != null)
                return Conflict("Email já registrado.");

            if (!Enum.IsDefined(typeof(UserRole), user.Role))
                return BadRequest("Tipo de usuário inválido.");

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);

            var newUser = new User
            {
                Name = user.Name,
                Email = user.Email,
                PasswordHash = passwordHash,
                Role = user.Role
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            var jwtKey = _config["Jwt:Key"];
            var key = Encoding.ASCII.GetBytes(jwtKey);

            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, newUser.Id.ToString()),
        new Claim(ClaimTypes.Name, newUser.Name),
        new Claim(ClaimTypes.Role, newUser.Role.ToString())
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

            return Ok(new
            {
                Token = tokenHandler.WriteToken(token)
            });
        }
    }
}