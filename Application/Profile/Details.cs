using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Profile;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profile
{
    public class Details
    {
        public class Query : IRequest<ProfileDTO>
        {
            public string Username { get; set; }

        }
        public class Handler : IRequestHandler<Query, ProfileDTO>
        {
            private readonly DataContext context;
            private readonly IProfileReader profileReader;
            public Handler(IProfileReader profileReader)
            {
                this.profileReader = profileReader;
               

            }
            public async Task<ProfileDTO> Handle(Query request, CancellationToken cancellationToken)
            {
                // var user = await context.Users.SingleOrDefaultAsync(u => u.UserName == request.Username);

                // return new ProfileDTO
                // {
                //     DisplayName = user.DisplayName,
                //     UserName = user.UserName,
                //     Image = user.Photos.FirstOrDefault(u => u.isMain)?.Url,
                //     Photos = user.Photos,
                //     Bio = user.Bio
                // };
                return await profileReader.ReadProfile(request.Username);
            }
        }
    }
}