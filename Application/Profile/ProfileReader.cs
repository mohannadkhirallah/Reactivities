using System.Linq;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profile
{
    public class ProfileReader : IProfileReader
    {
        private readonly DataContext context;
        private readonly IUserAccessor userAccessor;
        public ProfileReader(DataContext context, IUserAccessor userAccessor)
        {
            this.userAccessor = userAccessor;
            this.context = context;
        }

        public async Task<ProfileDTO> ReadProfile(string username)
        {
            var user =await context.Users.SingleOrDefaultAsync(u =>u.UserName==username);
            if(user ==null)
            throw new RestException(System.Net.HttpStatusCode.NotFound,new {Users="Not found"});

            var currentUser = await context.Users.SingleOrDefaultAsync(u =>u.UserName == userAccessor.GetCurrentUsername());

            var profile=new ProfileDTO
            {
                    DisplayName =user.DisplayName,
                    UserName =user.UserName,
                    Image= user.Photos.FirstOrDefault( u=>u.isMain)?.Url,
                    Photos =user.Photos,
                    Bio= user.Bio,
                    FollwersCount =user.Followers.Count,
                    FollowingCount=user.Followings.Count

            };

            if(currentUser.Followings.Any(u =>u.TargetId == user.Id))
                 profile.IsFollowed=true;

            return profile;
        }
    }
}