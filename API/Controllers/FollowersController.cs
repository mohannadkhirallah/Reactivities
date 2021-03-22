using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Followers;
using Application.Profile;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/profiles")]
    public class FollowersController :BaseController
    {
        [HttpPost("{username}/follow")]
        public async Task<ActionResult<Unit>> Follow(string username)
        {
            return await Mediator.Send(new Add.Command{username=username});
        }
        [HttpDelete("{username}/follow")]   
        public async Task<ActionResult<Unit>> Delete(string username)
        {
            return await Mediator.Send(new Delete.Command {username=username});
        }

        [HttpGet("{username}/follow")]
        public async Task<ActionResult<List<ProfileDTO>>> GetFollowings (string username, string predicate)
        {
            return await Mediator.Send(new List.Query{Username=username,Predicate =predicate});
        }
    }
}