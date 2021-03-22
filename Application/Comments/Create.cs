using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<CommentDTO>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
            public string Username { get; set; }
        }
        public class Handler : IRequestHandler<Command, CommentDTO>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                this.mapper = mapper;
                this.context = context;

            }
            public async Task<CommentDTO> Handle(Command request, CancellationToken cancellationToken)
            {

                var activity = await context.Activities.FindAsync(request.ActivityId);
                if(activity ==null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new {Activity ="Not found"});
                
                var user = await context.Users.SingleOrDefaultAsync(x=>x.UserName == request.Username);

                var comment=new Comment
                {
                    Author=user,
                    Activity =activity,
                    Body=request.Body,
                    CreatedAt=DateTime.Now
                };

                activity.Comments.Add(comment);

                var success = await context.SaveChangesAsync() > 0;

                if (success) return mapper.Map<CommentDTO>(comment);

                throw new Exception("Problem in saving changes");
            }
        }
    }
}