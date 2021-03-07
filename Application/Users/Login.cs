using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.Users
{
    public class Login
    {
        public class Query : IRequest<User>
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();
            }
        }
        public class Handler : IRequestHandler<Query, User>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> userManager;
            private readonly SignInManager<AppUser> signInManager;
            private readonly IJwtGenerator jwtGenerator;

            public Handler(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IJwtGenerator jwtGenerator)
            {
                this.signInManager = signInManager;
                this.jwtGenerator = jwtGenerator;
                this.userManager = userManager;

            }
            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {

                // Hanlde logic goes here

                var user=await userManager.FindByEmailAsync(request.Email);
                if( user==null)
                    throw new RestException (HttpStatusCode.Unauthorized);

                var result= await signInManager.CheckPasswordSignInAsync(user,request.Password,false);
                if(result.Succeeded)
                {
                    // TODO: Generate Token 
                    return new User{
                        DisplayName=user.DisplayName,
                        Token=jwtGenerator.CreateToken(user),
                        Username=user.UserName,
                        Image=user.Photos.FirstOrDefault(x=>x.isMain)?.Url
                    };
                }
                throw new RestException(HttpStatusCode.Unauthorized);


            }
        }
    }
}