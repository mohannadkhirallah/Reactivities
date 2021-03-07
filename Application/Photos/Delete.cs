using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext context;
            private readonly IPhotoAccessor photoAccessor;
            private readonly IUserAccessor userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
            {
                this.userAccessor = userAccessor;
                this.photoAccessor = photoAccessor;
                this.context = context;

            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {

                var user = await context.Users.SingleOrDefaultAsync (u =>u.UserName == userAccessor.GetCurrentUsername());
                var photo =user.Photos.FirstOrDefault(a =>a.Id ==request.Id);
                if(photo ==null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound,new {Photo ="Not found"});

                if(photo.isMain)
                    throw new RestException(HttpStatusCode.BadRequest, new {Photo ="You cannot delete your main photo"});
                
                var result = photoAccessor.DeletePhoto(photo.Id);
                if(result ==null)
                    throw new Exception("Problem deleting the photo");

                user.Photos.Remove(photo);
                
                var success = await context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}