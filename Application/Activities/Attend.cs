using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Attend
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }

        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this.userAccessor = userAccessor;
                this.context = context;

            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // handler logic
                var actitivty= await context.Activities.FindAsync(request.Id);
                if(actitivty ==null) 
                    throw new RestException(System.Net.HttpStatusCode.NotFound,
                                            new {actitivty="Could not find activity"});

                var user = await context.Users.SingleOrDefaultAsync(u => u.UserName == userAccessor.GetCurrentUsername());

                var attendance= await context.UserActivities.SingleOrDefaultAsync(x=> x.ActivityId == actitivty.Id && x.AppUserId == user.Id);
                if(attendance !=null)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest,new {attendance="Already attending this activity"});

                    attendance= new UserActivity
                    {
                        Activity=actitivty,
                        AppUser= user,
                        IsHost=false,
                        DateJoined= DateTime.Now
                    };

                    context.UserActivities.Add(attendance);

                var success = await context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new System.Exception("Problem in saving changes");
            }
        }
    }
}