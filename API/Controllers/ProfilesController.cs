using System.Threading.Tasks;
using Application.Profile;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseController
    {
        [HttpGet("{username}")]
        public async Task<ActionResult<ProfileDTO>> Get(string username)
        {
            return await Mediator.Send(new Details.Query{Username=username});
        }
        
    }
}