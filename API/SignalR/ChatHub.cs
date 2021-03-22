using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator mediator;
        public ChatHub(IMediator mediator)
        {
            this.mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            string username = Username();
            command.Username = username;
            var comment = await mediator.Send(command);
            await Clients.Group(command.ActivityId.ToString()).SendAsync("ReceiveComments", comment);
        }

        private string Username()
        {
            return Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        }

        public async Task AddToGroup (string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId,groupName);
            await Clients.Group(groupName).SendAsync("Send",$"{Username()} has joined the group");
        }
             public async Task RemoveFromGroup (string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId,groupName);
            await Clients.Group(groupName).SendAsync("Send",$"{Username()} has left the group");
        }
    }
}