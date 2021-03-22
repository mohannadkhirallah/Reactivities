using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Profile;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<List<ProfileDTO>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; } //Query string value
        }

        public class Handler : IRequestHandler<Query, List<ProfileDTO>>
        {
            private readonly DataContext context;
            private readonly IProfileReader profileReader;
            public Handler(DataContext context, IProfileReader profileReader)
            {
                this.profileReader = profileReader;
                this.context = context;
            }

            public async Task<List<ProfileDTO>> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable = context.Followings.AsQueryable();
                var userFollowings =new List<UserFollowing>();
                var profiles = new List<ProfileDTO>();

                switch (request.Predicate)
                {
                    case "followers":
                    {
                        userFollowings = await queryable.Where( x=> x.Target.UserName == request.Username).ToListAsync();
                        foreach (var follower in userFollowings)
                        {
                            profiles.Add(await profileReader.ReadProfile(follower.Observer.UserName));
                        }
                        break;
                    }
                     case "following":
                    {
                        userFollowings = await queryable.Where( x=> x.Observer.UserName == request.Username).ToListAsync();
                        foreach (var follower in userFollowings)
                        {
                            profiles.Add(await profileReader.ReadProfile(follower.Target.UserName));
                        }
                        break;
                    }
                    
                    default:
                    break;
                }
                return profiles;
                
            }
        }
    }
}