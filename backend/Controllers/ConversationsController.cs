using backend.Data;
using backend.Dto;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ConversationsController : ControllerBase
    {
        private readonly IConversationService _conversationService;

        public ConversationsController(IConversationService conversationService)
        {
            _conversationService = conversationService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrGetConversation([FromBody] CreateConversationDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userId, out var userGuid))
                return Unauthorized();

            var conversation = await _conversationService.GetOrCreateConversationAsync(userGuid, dto.OtherUserId);
            if (conversation == null)
                return BadRequest("Não é possível iniciar conversa com o mesmo usuário");

            return Ok(conversation);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserConversations(Guid userId)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(currentUserId, out var userGuid))
                return Unauthorized();

            // Usuário pode ver apenas suas próprias conversas
            if (userGuid != userId)
                return Forbid();

            var conversations = await _conversationService.GetUserConversationsAsync(userId);
            return Ok(conversations);
        }
    }
}
