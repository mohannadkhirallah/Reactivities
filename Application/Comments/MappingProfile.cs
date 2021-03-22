using System.Linq;
using Domain;

namespace Application.Comments
{
    public class MappingProfile :AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<Comment,CommentDTO>()
                .ForMember(d=>d.DisplayName, o =>o.MapFrom(s=>s.Author.DisplayName))
                .ForMember(d=>d.Username, o =>o.MapFrom(s=>s.Author.UserName))
                .ForMember(d=>d.Image, o =>o.MapFrom(s=>s.Author.Photos.FirstOrDefault(p=>p.isMain).Url));
        }
    }
}