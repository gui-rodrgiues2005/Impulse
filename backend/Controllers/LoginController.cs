
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using Microsoft.AspNetCore.Identity;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LoginController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDto user)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(user.Password, existingUser.PasswordHash);
            if (!isPasswordValid)
            {
                return Unauthorized("Senha incorreta.");
            }

            return Ok(new { Message = "Login bem-sucedido.", UserId = existingUser.Id, Role = existingUser.Role });
        }
    }
}