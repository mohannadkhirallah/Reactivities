using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {

    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _context;
        private readonly IHttpContextAccessor _httpAccessorContext;
        public IsHostRequirementHandler(IHttpContextAccessor httpAccessorContext, DataContext context)
        {
            _httpAccessorContext = httpAccessorContext;
            _context = context;

        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var currentUser= _httpAccessorContext.HttpContext.User?.Claims?.SingleOrDefault( u =>u.Type == ClaimTypes.NameIdentifier)?.Value;
            var activityId = Guid.Parse(_httpAccessorContext.HttpContext.Request.RouteValues.SingleOrDefault( k =>k.Key=="id").Value.ToString());
            var activity = _context.Activities.FindAsync(activityId).Result;
            var host = activity.UserActivities.FirstOrDefault( x=>x.IsHost);
            if(host?.AppUser?.UserName == currentUser)
            {
                context.Succeed(requirement);
            }
            return Task.CompletedTask;
        }
    }
}