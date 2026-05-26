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
        public async Task<IActionResult> GetCompany(Guid id)
        {
            var company = await _context.Companies

                .Include(c => c.Recruiters)

                .ThenInclude(r => r.User)

                .FirstOrDefaultAsync(c => c.Id == id);

            if (company == null)
            {
                return NotFound(new
                {
                    message = "Empresa não encontrada."
                });
            }

            return Ok(new
            {
                company.Id,
                company.Name,
                company.Description,
                company.Website,
                company.LogoUrl,
                company.Location,

                company.LegalName,
                company.Cnpj,
                company.Sector,
                company.Areas,

                Recruiters = company.Recruiters.Select(r => new
                {
                    r.Id,
                    r.Position,

                    User = new
                    {
                        r.User.Id,
                        r.User.Name,
                        r.User.Email
                    }
                })
            });
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
            company.LegalName = dto.LegalName;
            company.Cnpj = dto.Cnpj;
            company.Sector = dto.Sector;
            company.Areas = dto.Areas;

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

        // UPDATE RECRUITER
        [HttpPut("{companyId}/recruiters/{recruiterId}")]
        public async Task<IActionResult> UpdateRecruiter(
            Guid companyId,
            Guid recruiterId,
            [FromBody] AddRecruiterDto dto
        )
        {
            var recruiter = await _context.RecruiterProfiles

                .Include(r => r.User)

                .FirstOrDefaultAsync(r =>
                    r.Id == recruiterId &&
                    r.CompanyId == companyId
                );

            if (recruiter == null)
            {
                return NotFound(new
                {
                    message = "Recrutador não encontrado."
                });
            }

            recruiter.Position = dto.Position;

            if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                recruiter.User.Email = dto.Email;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Recrutador atualizado."
            });
        }

        // CREATE JOB
        [HttpPost("{companyId}/jobs")]
        public async Task<IActionResult> CreateJob(
            Guid companyId,
            [FromBody] CreateJobDto dto
        )
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.Id == companyId);

            if (company == null)
            {
                return NotFound(new
                {
                    message = "Empresa não encontrada."
                });
            }

            var job = new Models.Job
            {
                Title = dto.Title,
                Area = dto.Area,
                Type = dto.Type,
                Location = dto.Location,
                CompanyId = companyId,
                Status = "Aberta",
                Candidates = 0
            };

            _context.Jobs.Add(job);

            await _context.SaveChangesAsync();

            return Ok(job);
        }

        // LIST JOBS
        [HttpGet("{companyId}/jobs")]
        public async Task<IActionResult> GetJobs(
            Guid companyId
        )
        {
            var jobs = await _context.Jobs

                .Where(j => j.CompanyId == companyId)

                .OrderByDescending(j => j.CreatedAt)

                .ToListAsync();

            return Ok(jobs);
        }

        // UPDATE JOB
        [HttpPut("{companyId}/jobs/{jobId}")]
        public async Task<IActionResult> UpdateJob(
            Guid companyId,
            Guid jobId,
            [FromBody] CreateJobDto dto
        )
        {
            var job = await _context.Jobs

                .FirstOrDefaultAsync(j =>
                    j.Id == jobId &&
                    j.CompanyId == companyId
                );

            if (job == null)
            {
                return NotFound(new
                {
                    message = "Vaga não encontrada."
                });
            }

            job.Title = dto.Title;
            job.Area = dto.Area;
            job.Type = dto.Type;
            job.Location = dto.Location;

            await _context.SaveChangesAsync();

            return Ok(job);
        }

    }
}