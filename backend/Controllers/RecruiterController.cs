using API.DTOs.Recruiter;
using backend.Data;
using backend.Models;
using backend.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
namespace API.Controllers;

[ApiController]
[Route("api/recruiter")]
public class RecruiterController : ControllerBase
{
    private readonly AppDbContext _context;

    public RecruiterController(
        AppDbContext context
    )
    {
        _context = context;
    }


    [HttpGet("talents")]
    public async Task<ActionResult<List<TalentResponseDto>>> GetTalents()
    {
        var students = await _context.Users
            .Where(x => x.Role == UserRole.Student)
            .Select(x => new TalentResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                Course = x.Course,
                Level = x.Level,
                Description = x.Bio,
                AvatarUrl = x.AvatarUrl,

                Skills = x.Skills
                    .Select(skill => skill.Name)
                    .ToList()
            })
            .ToListAsync();

        return Ok(students);
    }

    [Authorize]
    [HttpPost("save-talent/{studentId}")]
    public async Task<IActionResult> SaveTalent(Guid studentId)
    {
        var recruiterId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(recruiterId))
        {
            return Unauthorized("ID claim não encontrada no token.");
        }

        var alreadySaved =
            await _context.SavedTalents.AnyAsync(x =>
                x.RecruiterId == Guid.Parse(recruiterId) &&
                x.StudentId == studentId
            );

        if (alreadySaved)
        {
            return BadRequest(
                "Talento já salvo."
            );
        }

        var savedTalent = new Models.SavedTalent
        {
            RecruiterId = Guid.Parse(recruiterId),
            StudentId = studentId
        };

        _context.SavedTalents.Add(savedTalent);

        await _context.SaveChangesAsync();

        return Ok();
    }

    [Authorize]
    [HttpGet("saved-talents")]
    public async Task<ActionResult<List<TalentResponseDto>>> GetSavedTalents()
    {
        var recruiterId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(recruiterId))
        {
            return Unauthorized("ID claim não encontrada no token.");
        }

        var talents = await _context.SavedTalents
            .Where(x => x.RecruiterId == Guid.Parse(recruiterId))
            .Select(x => new TalentResponseDto
            {
                Id = x.Student.Id,
                Name = x.Student.Name,
                Course = x.Student.Course,
                Level = x.Student.Level,
                Description = x.Student.Bio,
                AvatarUrl = x.Student.AvatarUrl,

                Skills = x.Student.Skills
                    .Select(skill => skill.Name)
                    .ToList()
            })
            .ToListAsync();

        return Ok(talents);
    }
}