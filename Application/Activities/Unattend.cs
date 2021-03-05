using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Unattend
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class RequestHandler : IRequestHandler<Command>
        {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;
            public RequestHandler(DataContext context, IUserAccessor userAccessor)
            {
                this.userAccessor = userAccessor;
                this.context = context;

            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {   
                // Handler logic
                 var actitivty= await context.Activities.FindAsync(request.Id);
                if(actitivty ==null) 
                    throw new RestException(HttpStatusCode.NotFound,
                                            new {actitivty="Could not find activity"});

                var user = await context.Users.SingleOrDefaultAsync(u => u.UserName == userAccessor.GetCurrentUsername());

                var attendance= await context.UserActivities.SingleOrDefaultAsync(x=> x.ActivityId == actitivty.Id && x.AppUserId == user.Id);
                if(attendance ==null)
                    return Unit.Value;

                if(attendance.IsHost)
                throw new RestException(HttpStatusCode.BadRequest,new {attendance="You cannot remove yourself as host"});

                context.UserActivities.Remove(attendance);


                var success= await context.SaveChangesAsync() >0;
                if(success) return Unit.Value;

                throw new Exception("Problem in saving changes");
            }
        }
    }
}