using backend.Data;
using backend.Dtos;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public JobsController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL JOBS
        [HttpGet]
        public async Task<IActionResult> GetAllJobs()
        {
            var jobs = await _context.Jobs
                .Include(j => j.Company)
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();

            return Ok(jobs.Select(j => new
            {
                j.Id,
                j.Title,
                j.Area,
                j.Type,
                j.Location,
                j.Status,
                j.Candidates,
                j.CreatedAt,
                Company = new
                {
                    j.Company.Id,
                    j.Company.Name,
                    j.Company.LogoUrl,
                    j.Company.Location
                }
            }));
        }

        // GET JOB BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetJobById(Guid id)
        {
            var job = await _context.Jobs
                .Include(j => j.Company)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
            {
                return NotFound(new { message = "Vaga não encontrada." });
            }

            return Ok(new
            {
                job.Id,
                job.Title,
                job.Area,
                job.Type,
                job.Location,
                job.Status,
                job.Candidates,
                job.CreatedAt,
                Company = new
                {
                    job.Company.Id,
                    job.Company.Name,
                    job.Company.LogoUrl,
                    job.Company.Location,
                    job.Company.Description
                }
            });
        }

        // CREATE JOB - ONLY COMPANY
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] CreateJobDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("ID claim não encontrada no token.");
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id.ToString() == userId);

            if (user == null || user.Role.ToString() != "Company")
            {
                return StatusCode(403, new { message = "Apenas empresas podem criar vagas." });
            }

            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == Guid.Parse(userId));

            if (company == null)
            {
                return NotFound(new { message = "Empresa não encontrada." });
            }

            var job = new Job
            {
                Title = dto.Title,
                Area = dto.Area,
                Type = dto.Type,
                Location = dto.Location,
                CompanyId = company.Id
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Vaga criada com sucesso.",
                job = new
                {
                    job.Id,
                    job.Title,
                    job.Area,
                    job.Type,
                    job.Location,
                    job.CompanyId
                }
            });
        }

        // UPDATE JOB - ONLY COMPANY OWNER
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(Guid id, [FromBody] CreateJobDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("ID claim não encontrada no token.");
            }

            var job = await _context.Jobs
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
            {
                return NotFound(new { message = "Vaga não encontrada." });
            }

            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.Id == job.CompanyId && c.UserId == Guid.Parse(userId));

            if (company == null)
            {
                return StatusCode(403, new { message = "Você não tem permissão para atualizar esta vaga." });
            }

            job.Title = dto.Title;
            job.Area = dto.Area;
            job.Type = dto.Type;
            job.Location = dto.Location;

            _context.Jobs.Update(job);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Vaga atualizada com sucesso." });
        }

        // DELETE JOB - ONLY COMPANY OWNER
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("ID claim não encontrada no token.");
            }

            var job = await _context.Jobs
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
            {
                return NotFound(new { message = "Vaga não encontrada." });
            }

            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.Id == job.CompanyId && c.UserId == Guid.Parse(userId));

            if (company == null)
            {
                return StatusCode(403, new { message = "Você não tem permissão para deletar esta vaga." });
            }

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Vaga deletada com sucesso." });
        }
    }
}
