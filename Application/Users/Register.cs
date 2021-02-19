using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
    public class Register
    {
        public class Command : IRequest<User>
        {
            public string DisplayName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }
        public class CommmandValidator :AbstractValidator<Command>
        {
            public CommmandValidator()
            {
                RuleFor(x=>x.DisplayName).NotEmpty();
                RuleFor(x=>x.Username).NotEmpty();
                RuleFor(x=>x.Email).NotEmpty().EmailAddress();
                // Custom validator for Password by implementing extension method
                RuleFor(x=>x.Password).Password();

            }
        }
        public class Handler : IRequestHandler<Command,User>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(DataContext context ,UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
            {
                _context=context;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
            }
            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {
                if( await _context.Users.AnyAsync(e=>e.Email==request.Email))
                    throw new RestException (HttpStatusCode.BadRequest,new {Email="Email already exist"});

                 if( await _context.Users.AnyAsync(e=>e.UserName==request.Username))
                    throw new RestException (HttpStatusCode.BadRequest,new {UserName="Username already exist"});
                var user= new AppUser
                {
                    DisplayName= request.Username,
                    Email= request.Email,
                    UserName= request.Username
                };

                var result= await _userManager.CreateAsync(user,request.Password);
                if(result.Succeeded)
                {
                    return new User
                    {
                        DisplayName= user.DisplayName,
                        Token= _jwtGenerator.CreateToken(user),
                        Username= user.UserName,
                        Image=null

                    };
                }

                throw new Exception("Problem creating user");
            }
        }
    }
}