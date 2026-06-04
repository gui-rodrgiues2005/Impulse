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

        // =========================================
        // BUSCA TODAS AS VAGAS
        // Retorna lista de vagas com dados da empresa
        // Acessível por qualquer usuário (sem autenticação)
        // =========================================
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
                Company = j.Company == null ? null : new
                {
                    j.Company.Id,
                    j.Company.Name,
                    j.Company.LogoUrl,
                    j.Company.Location
                }
            }));
        }

        // =========================================
        // BUSCA VAGA POR ID
        // Retorna detalhes de uma vaga específica
        // Acessível por qualquer usuário (sem autenticação)
        // =========================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetJobById(Guid id)
        {
            var job = await _context.Jobs
                .Include(j => j.Company)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
                return NotFound(new { message = "Vaga não encontrada." });

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
                Company = job.Company == null ? null : new
                {
                    job.Company.Id,
                    job.Company.Name,
                    job.Company.LogoUrl,
                    job.Company.Location,
                    job.Company.Description
                }
            });
        }

        // =========================================
        // CRIA UMA NOVA VAGA
        // Apenas empresas autenticadas podem criar vagas
        // O CompanyId é buscado automaticamente pelo UserId do token
        // =========================================
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] CreateJobDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("ID claim não encontrada no token.");

            // Verifica se o usuário existe
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id.ToString() == userId);

            if (user == null)
                return StatusCode(403, new { message = $"Usuário não encontrado. UserId do token: '{userId}'" });

            // Verifica se o usuário é do tipo Company
            if (user.Role.ToString() != "Company")
                return StatusCode(403, new { message = $"Role atual: '{user.Role}' | ToString: '{user.Role.ToString()}'" });

            // Busca a empresa vinculada ao usuário
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == Guid.Parse(userId));

            if (company == null)
                return NotFound(new { message = $"Empresa não encontrada para UserId: '{userId}'" });

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

        // =========================================
        // ATUALIZA UMA VAGA
        // Apenas a empresa dona da vaga pode atualizar
        // Verifica se o CompanyId da vaga pertence ao usuário logado
        // =========================================
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(Guid id, [FromBody] CreateJobDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("ID claim não encontrada no token.");

            var job = await _context.Jobs
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
                return NotFound(new { message = "Vaga não encontrada." });

            // Verifica se a empresa dona da vaga pertence ao usuário logado
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.Id == job.CompanyId && c.UserId == Guid.Parse(userId));

            if (company == null)
                return StatusCode(403, new { message = "Você não tem permissão para atualizar esta vaga." });

            job.Title = dto.Title;
            job.Area = dto.Area;
            job.Type = dto.Type;
            job.Location = dto.Location;

            _context.Jobs.Update(job);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Vaga atualizada com sucesso." });
        }

        // =========================================
        // DELETA UMA VAGA
        // Apenas a empresa dona da vaga pode deletar
        // =========================================
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("ID claim não encontrada no token.");

            var job = await _context.Jobs
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
                return NotFound(new { message = "Vaga não encontrada." });

            // Verifica se a empresa dona da vaga pertence ao usuário logado
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.Id == job.CompanyId && c.UserId == Guid.Parse(userId));

            if (company == null)
                return StatusCode(403, new { message = "Você não tem permissão para deletar esta vaga." });

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Vaga deletada com sucesso." });
        }

        // =========================================
        // CANDIDATAR-SE A UMA VAGA
        // Apenas alunos autenticados podem se candidatar
        // Impede candidatura duplicada
        // Incrementa o contador de candidatos na vaga
        // Cria uma notificação para a empresa
        // =========================================
        [Authorize]
        [HttpPost("{id}/apply")]
        public async Task<IActionResult> ApplyToJob(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("ID claim não encontrada no token.");

            // Verifica se o usuário é aluno
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id.ToString() == userId);

            if (user == null || user.Role.ToString() != "Student")
                return StatusCode(403, new { message = "Apenas alunos podem se candidatar a vagas." });

            // Verifica se a vaga existe
            var job = await _context.Jobs
                .Include(j => j.Company)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
                return NotFound(new { message = "Vaga não encontrada." });

            // Verifica se a vaga está aberta
            if (job.Status != "Aberta")
                return BadRequest(new { message = "Esta vaga não está mais aceitando candidaturas." });

            // Verifica se o aluno já se candidatou
            var alreadyApplied = await _context.JobApplications
                .AnyAsync(ja => ja.JobId == id && ja.StudentUserId == Guid.Parse(userId));

            if (alreadyApplied)
                return BadRequest(new { message = "Você já se candidatou a esta vaga." });

            // Cria a candidatura
            var application = new JobApplication
            {
                JobId = id,
                StudentUserId = Guid.Parse(userId)
            };

            _context.JobApplications.Add(application);

            // Incrementa o contador de candidatos
            job.Candidates += 1;
            _context.Jobs.Update(job);

            // Cria notificação para a empresa
            var notification = new Notification
            {
                CompanyId = job.CompanyId,
                JobId = job.Id,
                StudentUserId = Guid.Parse(userId),
                Message = $"{user.Name} se candidatou à vaga \"{job.Title}\"."
            };

            _context.Notifications.Add(notification);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Candidatura realizada com sucesso!" });
        }

        // =========================================
        // BUSCA CANDIDATOS DE UMA VAGA
        // Apenas a empresa dona da vaga pode ver os candidatos
        // Retorna: dados do aluno, perfil, bio, skills
        // =========================================
        [Authorize]
        [HttpGet("{id}/candidates")]
        public async Task<IActionResult> GetCandidates(Guid id)
        {
            if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userGuid))
                return Unauthorized();

            // Verifica se a vaga existe
            var job = await _context.Jobs
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
                return NotFound(new { message = "Vaga não encontrada." });

            // Verifica se a empresa dona da vaga pertence ao usuário logado
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.Id == job.CompanyId && c.UserId == userGuid);

            if (company == null)
                return StatusCode(403, new { message = "Sem permissão." });

            // Busca candidatos com perfil, bio e skills
            var candidates = await _context.JobApplications
                .Where(ja => ja.JobId == id)
                .Include(ja => ja.StudentUser)
                    .ThenInclude(u => u.StudentProfile)
                .Include(ja => ja.StudentUser)
                    .ThenInclude(u => u.Skills)
                .OrderByDescending(ja => ja.AppliedAt)
                .Select(ja => new
                {
                    ja.Id,
                    ja.AppliedAt,
                    ja.Status,
                    Student = new
                    {
                        ja.StudentUser.Id,
                        ja.StudentUser.Name,
                        ja.StudentUser.Email,
                        ja.StudentUser.AvatarUrl,
                        Profile = ja.StudentUser.StudentProfile == null ? null : new
                        {
                            ja.StudentUser.StudentProfile.Course,
                            ja.StudentUser.StudentProfile.University,
                            ja.StudentUser.StudentProfile.Linkedin,
                            ja.StudentUser.StudentProfile.Github,
                            ja.StudentUser.StudentProfile.Location,
                            ja.StudentUser.StudentProfile.Bio,
                            ja.StudentUser.StudentProfile.ProfileImage,
                        },
                        Skills = ja.StudentUser.Skills
                            .Select(s => s.Name)
                            .ToList()
                    }
                })
                .ToListAsync();

            return Ok(candidates);
        }
    }
}