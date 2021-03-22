using System.Threading.Tasks;

namespace Application.Profile
{
    public interface IProfileReader
    {
         Task<ProfileDTO> ReadProfile(string username);
    }
}