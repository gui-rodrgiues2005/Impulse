using backend.Dto;
using backend.Services;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace backend.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IMessageService _messageService;
        private readonly IConversationService _conversationService;

        public ChatHub(IMessageService messageService, IConversationService conversationService)
        {
            _messageService = messageService;
            _conversationService = conversationService;
        }

        public async Task JoinConversation(Guid conversationId)
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null || !Guid.TryParse(userId, out var userGuid))
            {
                await Clients.Caller.SendAsync("Error", "Usuário não autenticado");
                return;
            }

            // Verificar se usuário é participante
            var isParticipant = await _conversationService.IsUserParticipantAsync(conversationId, userGuid);
            if (!isParticipant)
            {
                await Clients.Caller.SendAsync("Error", "Acesso negado");
                return;
            }

            // Adicionar conexão ao grupo da conversa
            await Groups.AddToGroupAsync(Context.ConnectionId, $"conversation-{conversationId}");
            await Clients.Group($"conversation-{conversationId}").SendAsync("UserJoined", new
            {
                UserId = userGuid,
                Timestamp = DateTime.UtcNow
            });
        }

        public async Task SendMessage(Guid conversationId, string content)
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null || !Guid.TryParse(userId, out var userGuid))
            {
                await Clients.Caller.SendAsync("Error", "Usuário não autenticado");
                return;
            }

            // Verificar se usuário é participante
            var isParticipant = await _conversationService.IsUserParticipantAsync(conversationId, userGuid);
            if (!isParticipant)
            {
                await Clients.Caller.SendAsync("Error", "Acesso negado");
                return;
            }

            // Salvar mensagem no banco
            var message = await _messageService.SendMessageAsync(conversationId, userGuid, content);
            if (message == null)
            {
                await Clients.Caller.SendAsync("Error", "Erro ao enviar mensagem");
                return;
            }

            // Enviar para todos os participantes
            await Clients.Group($"conversation-{conversationId}").SendAsync("ReceiveMessage", message);
        }

        public async Task LeaveConversation(Guid conversationId)
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId != null && Guid.TryParse(userId, out var userGuid))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"conversation-{conversationId}");
                await Clients.Group($"conversation-{conversationId}").SendAsync("UserLeft", new
                {
                    UserId = userGuid,
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
        }
    }
}
