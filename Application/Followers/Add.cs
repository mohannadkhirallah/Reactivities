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

namespace Application.Followers
{
    public class Add
    {
        public class Command : IRequest
        {
            public string username { get; set; }
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
                var observer = await context.Users.SingleOrDefaultAsync(x=>x.UserName == userAccessor.GetCurrentUsername());

                var target = await context.Users.SingleOrDefaultAsync(x=>x.UserName == request.username);

                if(target == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound,new {Users="Not found"});

                var following = await context.Followings.SingleOrDefaultAsync(x=>x.ObserverId ==observer.Id && x.TargetId == target.Id);

                if(following !=null)
                throw new RestException(System.Net.HttpStatusCode.BadRequest, new {User ="You aare already folliwng this user"});

                following =new UserFollowing {
                    Observer =observer,
                    Target= target
                };
                context.Followings.Add(following);

                var success = await context.SaveChangesAsync() > 0;
                if (success)
                    return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}