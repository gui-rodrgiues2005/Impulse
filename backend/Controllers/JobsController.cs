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
public async Task<IActionResult> GetAllJobs([FromQuery] string? type, [FromQuery] string? specialty)
{
    var query = _context.Jobs
        .Include(j => j.Company)
        .Where(j => j.Status == "Aberta") // ← ADICIONA ISSO
        .AsQueryable();

    // Filtro por tipo de contrato (CLT, PJ, Estágio, etc)
    if (!string.IsNullOrEmpty(type))
        query = query.Where(j => j.Type.ToLower().Contains(type.ToLower()));

    // Filtro por especialidade/área (Odontologia, TI, Design, etc)
    if (!string.IsNullOrEmpty(specialty))
        query = query.Where(j => j.Area.ToLower().Contains(specialty.ToLower()));

    var jobs = await query
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
            j.Company.ProfileImage,
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
                    job.Company.ProfileImage,
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
    
    // Atualiza o status se vier no DTO
    if (!string.IsNullOrEmpty(dto.Status))
        job.Status = dto.Status;

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

// BUSCA AS VAGAS DA EMPRESA LOGADA
// Retorna todas as vagas (abertas e fechadas)
// =========================================
[Authorize]
[HttpGet("my-jobs")]
public async Task<IActionResult> GetMyJobs()
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

    if (string.IsNullOrEmpty(userId))
        return Unauthorized("ID claim não encontrada no token.");

    // Busca a empresa vinculada ao usuário
    var company = await _context.Companies
        .FirstOrDefaultAsync(c => c.UserId == Guid.Parse(userId));

    if (company == null)
        return NotFound(new { message = "Empresa não encontrada." });

    // Retorna TODAS as vagas da empresa (abertas e fechadas)
    var jobs = await _context.Jobs
        .Include(j => j.Company)
        .Where(j => j.CompanyId == company.Id)
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
            j.Company.ProfileImage,
            j.Company.Location
        }
    }));
}
 
        // =========================================
        // CANDIDATAR-SE A UMA VAGA
        // Apenas alunos autenticados podem se candidatar
        // Impede candidatura duplicada
        // Incrementa o contador de candidatos na vaga
        // Cria uma notificação para a empresa
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
                .Include(ja => ja.StudentUser!)
                    .ThenInclude(u => u.StudentProfile)
                .Include(ja => ja.StudentUser!)
                    .ThenInclude(u => u.Skills)
                .OrderByDescending(ja => ja.AppliedAt)
                .Select(ja => new
                {
                    ja.Id,
                    ja.AppliedAt,
                    ja.Status,
                    Student = ja.StudentUser == null ? null : new
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
                        Skills = ja.StudentUser.Skills == null
                            ? new List<string>()
                            : ja.StudentUser.Skills
                                .Select(s => s.Name)
                                .ToList()
                    }
                })
                .ToListAsync();

            return Ok(candidates);
        }

        [Authorize]
        [HttpGet("my-applications")]
        public async Task<IActionResult> GetMyApplications()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("ID claim não encontrada no token.");

            if (!Guid.TryParse(userId, out var userGuid))
                return Unauthorized("ID inválido no token.");

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userGuid);

            if (user == null || user.Role.ToString() != "Student")
                return StatusCode(403, new { message = "Apenas alunos podem ver suas candidaturas." });

            var applications = await _context.JobApplications
                .Where(ja => ja.StudentUserId == userGuid)
                .Include(ja => ja.Job!)
                    .ThenInclude(j => j.Company)
                .OrderByDescending(ja => ja.AppliedAt)
                .Select(ja => new
                {
                    ja.Id,
                    ja.JobId,
                    ja.AppliedAt,
                    ja.Status,
                    ja.Source,
                    Job = ja.Job == null ? null : new
                    {
                        ja.Job.Id,
                        ja.Job.Title,
                        ja.Job.Area,
                        ja.Job.Type,
                        ja.Job.Location,
                        ja.Job.Candidates,
                        Company = ja.Job.Company == null ? null : new
                        {
                            ja.Job.Company.Id,
                            ja.Job.Company.Name,
                            ja.Job.Company.ProfileImage,
                            ja.Job.Company.Location
                        }
                    }
                })
                .ToListAsync();

            return Ok(applications);
        }

        // CANDIDATAR-SE A UMA VAGA
        [Authorize]
        [HttpPost("{id}/apply")]
        public async Task<IActionResult> ApplyToJob(Guid id, [FromBody] ApplyJobDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("ID claim não encontrada no token.");

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id.ToString() == userId);

            if (user == null || user.Role.ToString() != "Student")
                return StatusCode(403, new { message = "Apenas alunos podem se candidatar a vagas." });

            var job = await _context.Jobs
                .Include(j => j.Company)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
                return NotFound(new { message = "Vaga não encontrada." });

            if (job.Status != "Aberta")
                return BadRequest(new { message = "Esta vaga não está mais aceitando candidaturas." });

            var alreadyApplied = await _context.JobApplications
                .AnyAsync(ja => ja.JobId == id && ja.StudentUserId == Guid.Parse(userId));

            if (alreadyApplied)
                return BadRequest(new { message = "Você já se candidatou a esta vaga." });

            var application = new JobApplication
            {
                JobId = id,
                StudentUserId = Guid.Parse(userId),
                Source = dto.Source // Salva a origem da candidatura
            };

            _context.JobApplications.Add(application);

            job.Candidates += 1;
            _context.Jobs.Update(job);

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

        // ORIGEM DAS CANDIDATURAS
        [HttpGet("{companyId}/applications/sources")]
        public async Task<IActionResult> GetApplicationSources(Guid companyId)
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.Id == companyId);

            if (company == null)
            {
                return NotFound(new { message = "Empresa não encontrada." });
            }

            var sources = await (
                from ja in _context.JobApplications
                join j in _context.Jobs on ja.JobId equals j.Id
                where j.CompanyId == companyId
                select ja.Source
            ).ToListAsync();

            var sourceCounts = sources
                .GroupBy(s => string.IsNullOrWhiteSpace(s) ? "Outros" : s)
                .Select(g => new { Source = g.Key, Count = g.Count() })
                .OrderByDescending(g => g.Count)
                .ToList();

            return Ok(sourceCounts);
        }

        // CRESCIMENTO MENSAL DE CANDIDATURAS
        [HttpGet("{companyId}/applications/monthly")]
        public async Task<IActionResult> GetMonthlyApplications(Guid companyId)
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.Id == companyId);

            if (company == null)
                return NotFound(new { message = "Empresa não encontrada." });

            // Busca candidaturas dos últimos 7 meses
            var cutoff = DateTime.UtcNow.AddMonths(-6);

            var applications = await (
                from ja in _context.JobApplications
                join j in _context.Jobs on ja.JobId equals j.Id
                where j.CompanyId == companyId && ja.AppliedAt >= cutoff
                select ja.AppliedAt
            ).ToListAsync();

            // Agrupa por mês em memória
            var monthlyData = applications
                .GroupBy(date => new { date.Year, date.Month })
                .OrderBy(g => g.Key.Year)
                .ThenBy(g => g.Key.Month)
            .Select(g => new
            {
                Mes = new DateTime(g.Key.Year, g.Key.Month, 1)
              .ToString("MMM", new System.Globalization.CultureInfo("pt-BR")),
                Candidatos = (int)g.Count()
            })
                .ToList();

            return Ok(monthlyData);
        }

        // STATS DO DASHBOARD
        [HttpGet("{companyId}/dashboard/stats")]
        public async Task<IActionResult> GetDashboardStats(Guid companyId)
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.Id == companyId);

            if (company == null)
                return NotFound(new { message = "Empresa não encontrada." });

            var agora = DateTime.UtcNow;
            var semanaAtras = agora.AddDays(-7);

            var jobs = await _context.Jobs
                .Where(j => j.CompanyId == companyId)
                .ToListAsync();

            var vagasAbertas = jobs.Count(j => j.Status == "Aberta");
            var novasVagasSemana = jobs.Count(j => j.CreatedAt >= semanaAtras);

            var candidaturasSemana = await (
                from ja in _context.JobApplications
                join j in _context.Jobs on ja.JobId equals j.Id
                where j.CompanyId == companyId && ja.AppliedAt >= semanaAtras
                select ja.Id
            ).CountAsync();

            var totalCandidatos = jobs.Sum(j => j.Candidates);

            return Ok(new
            {
                VagasAbertas = vagasAbertas,
                NovasVagasSemana = novasVagasSemana,
                TotalCandidatos = totalCandidatos,
                CandidatosSemana = candidaturasSemana
            });
        }
    }
}