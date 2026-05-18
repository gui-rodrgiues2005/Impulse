using backend.Data;
using backend.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CompanyController(
            AppDbContext context
        )
        {
            _context = context;
        }

        // GET COMPANY
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCompany(
            Guid id
        )
        {
            var company = await _context.Companies

                .Include(c => c.Recruiters)

                .ThenInclude(r => r.User)

                .FirstOrDefaultAsync(c => c.Id == id);

            if (company == null)
            {
                return NotFound(new { message = "Empresa não encontrada." });
            }

            return Ok(company);
        }

        // UPDATE COMPANY
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCompany(
            Guid id,
            [FromBody] UpdateCompanyDto dto
        )
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.Id == id);

            if (company == null)
            {
                return NotFound(new { message = "Empresa não encontrada." });
            }

            company.Name = dto.Name;
            company.Description = dto.Description;
            company.Website = dto.Website;
            company.Location = dto.Location;
            company.LogoUrl = dto.LogoUrl;

            await _context.SaveChangesAsync();

            return Ok(company);
        }

        // ADD RECRUITER
        [HttpPost("{companyId}/recruiters")]
        public async Task<IActionResult> AddRecruiter(
            Guid companyId,
            [FromBody] AddRecruiterDto dto
        )
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.Id == companyId);

            if (company == null)
            {
                return NotFound(new { message = "Empresa não encontrada." });
            }

            var user = await _context.Users

                .Include(u => u.RecruiterProfile)

                .FirstOrDefaultAsync(
                    u => u.Email == dto.Email
                );

            if (user == null)
            {
                return NotFound(new { message = "Usuário não encontrado." });
            }

            if (user.RecruiterProfile != null)
            {
                return BadRequest(new { message = "Usuário já é recrutador." });
            }

            user.Role = UserRole.Recruiter;

            var recruiter = new RecruiterProfile
            {
                UserId = user.Id,
                CompanyId = companyId,
                Position = dto.Position
            };

            _context.RecruiterProfiles.Add(recruiter);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Recrutador adicionado."
            });
        }


        // LIST RECRUITERS
        [HttpGet("{companyId}/recruiters")]
        public async Task<IActionResult> GetRecruiters(
            Guid companyId
        )
        {
            var recruiters = await _context
                .RecruiterProfiles

                .Include(r => r.User)

                .Where(r => r.CompanyId == companyId)

                .Select(r => new
                {
                    r.Id,

                    r.Position,

                    user = new
                    {
                        r.User.Id,
                        r.User.Name,
                        r.User.Email
                    }
                })

                .ToListAsync();

            return Ok(recruiters);
        }

        [HttpPost("{companyId}/invite-recruiter")]
        public async Task<IActionResult> InviteRecruiter(
    Guid companyId,
    [FromBody] InviteRecruiterDto dto
)
        {
            var user = await _context.Users
                .Include(u => u.RecruiterProfile)
                .FirstOrDefaultAsync(
                    u => u.Email == dto.Email
                );
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.Id == companyId);

            if (company == null)
                return BadRequest(new { message = "Empresa não existe" });
                
            if (user == null)
            {
                return NotFound(new { message = "Usuário não encontrado." });
            }

            if (user.RecruiterProfile != null)
            {
                return BadRequest(new { message = "Usuário já é recrutador." });
            }

            var alreadyInvited =
                await _context.RecruiterInvites
                .AnyAsync(i =>
                    i.UserId == user.Id &&
                    i.CompanyId == companyId &&
                    !i.Accepted
                );

            if (alreadyInvited)
            {
                return BadRequest(new { message = "Usuário já possui convite." });
            }

            var invite = new RecruiterInvite
            {
                UserId = user.Id,
                CompanyId = company.Id,
                Position = dto.Position
            };

            _context.RecruiterInvites.Add(invite);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Convite enviado."
            });
        }
    }
}