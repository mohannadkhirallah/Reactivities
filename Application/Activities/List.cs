using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities.DTOs;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class ActivitiesEnvelope
        {
            public List<ActivityDTO> Activities { get; set; }
            public int ActivityCount { get; set; }
        }
        public class Query : IRequest<ActivitiesEnvelope>
        {
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            private readonly bool isHost;
            public bool IsHost { get; }
            public bool IsGoing { get; }
            public DateTime? StartDate { get; }
            public Query(int? limit, int? offset, bool isGoing, bool isHost, DateTime? startDate)
            {
                this.StartDate = startDate ?? DateTime.Now;
                this.IsGoing = isGoing;
                this.IsHost = isHost;
                Limit = limit;
                Offset = offset;
            }

        }
        public class Handler : IRequestHandler<Query, ActivitiesEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                this.userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }
            public async Task<ActivitiesEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                // Eager loading 
                // var activities = await _context.Activities.Include(x => x.UserActivities).ThenInclude(x => x.AppUser).ToListAsync();
                //   var activities = await _context.Activities.ToListAsync();

                var queryable = _context.Activities
                                .Where(x => x.Date >= request.StartDate)
                                .OrderBy(x => x.Date).AsQueryable();

                if (request.IsGoing && !request.IsHost)
                    queryable = queryable.Where( u =>u.UserActivities.Any(a=>a.AppUser.UserName == userAccessor.GetCurrentUsername()));

                if(request.IsHost && !request.IsGoing)
                      queryable = queryable.Where( u =>u.UserActivities.Any(a=>a.AppUser.UserName == userAccessor.GetCurrentUsername() && a.IsHost));
                


                var activities = await queryable.Skip(request.Offset ?? 0).Take(request.Limit ?? 3).ToListAsync();

                return new ActivitiesEnvelope
                {
                    Activities = _mapper.Map<List<Activity>, List<ActivityDTO>>(activities),
                    ActivityCount = queryable.Count()

                };


            }
        }
    }
}