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
    public class MessagesController : ControllerBase
    {
        private readonly IMessageService _messageService;
        private readonly IConversationService _conversationService;

        public MessagesController(IMessageService messageService, IConversationService conversationService)
        {
            _messageService = messageService;
            _conversationService = conversationService;
        }

        [HttpGet("conversation/{conversationId}")]
        public async Task<IActionResult> GetConversationMessages(Guid conversationId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userId, out var userGuid))
                return Unauthorized();

            // Verificar se usuário é participante
            var isParticipant = await _conversationService.IsUserParticipantAsync(conversationId, userGuid);
            if (!isParticipant)
                return Forbid();

            var messages = await _messageService.GetConversationMessagesAsync(conversationId);
            return Ok(messages);
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userId, out var userGuid))
                return Unauthorized();

            // Verificar se usuário é participante
            var isParticipant = await _conversationService.IsUserParticipantAsync(dto.ConversationId, userGuid);
            if (!isParticipant)
                return Forbid();

            var message = await _messageService.SendMessageAsync(dto.ConversationId, userGuid, dto.Content);
            if (message == null)
                return BadRequest("Erro ao enviar mensagem");

            return Ok(message);
        }
    }
}
