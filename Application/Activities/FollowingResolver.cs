

using System.Linq;
using Application.Activities.DTOs;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class FollowingResolver : IValueResolver<UserActivity, AttendeeDTO, bool>
    {
        private readonly DataContext contextDb;
        private readonly IUserAccessor userAccessor;
        public FollowingResolver(DataContext context, IUserAccessor userAccessor)
        {
            this.userAccessor = userAccessor;
            this.contextDb = context;
        }

        public bool Resolve(UserActivity source, AttendeeDTO destination, bool destMember, ResolutionContext context)
        {
            var currentUser = contextDb.Users.SingleOrDefaultAsync( u =>u.UserName == userAccessor.GetCurrentUsername()).Result;
            if(currentUser.Followings.Any(x=>x.TargetId == source.AppUserId))
            {
                return true;
            }
            return false;
        
        }
    }
}