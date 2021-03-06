using System.Linq;
using Application.Activities.DTOs;
using AutoMapper;
using Domain;

namespace Application.Activities
{
    public class MappingProfile :AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity,ActivityDTO>();
            CreateMap<UserActivity,AttendeeDTO>()
            .ForMember(d =>d.Username, o => o.MapFrom(s =>s.AppUser.UserName))
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            .ForMember(d=>d.Image, o =>o.MapFrom(s=>s.AppUser.Photos.FirstOrDefault(x=>x.isMain==true).Url))
            .ForMember(d =>d.Following, o =>o.MapFrom<FollowingResolver>());
        }
    }
}