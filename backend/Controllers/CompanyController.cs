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
                company.ProfileImage,
                company.Location,

                company.LegalName,
                company.Cnpj,
                company.Sector,
                company.Areas
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
            company.ProfileImage = dto.ProfileImage;
            company.LegalName = dto.LegalName;
            company.Cnpj = dto.Cnpj;
            company.Sector = dto.Sector;
            company.Areas = dto.Areas;

            await _context.SaveChangesAsync();

            return Ok(company);
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