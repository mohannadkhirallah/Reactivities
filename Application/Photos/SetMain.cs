using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
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
                var user = await context.Users.SingleOrDefaultAsync(u=>u.UserName==userAccessor.GetCurrentUsername());
                var photo = user.Photos.FirstOrDefault(x=>x.Id == request.Id);
                if(photo ==null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound,new {Photos="Not found"});

                var currentMain = user.Photos.FirstOrDefault(x=>x.isMain);
                currentMain.isMain=false;
                photo.isMain=true;

                var success = await context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem in saving");
            }
        }
    }
}