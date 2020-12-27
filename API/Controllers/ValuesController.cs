using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        public DataContext _context { get; }
        public ValuesController(DataContext context)
        {
            this._context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Value>>> Get() => Ok( await _context.Values.ToListAsync());
        [HttpGet("{id}")]
        public async Task<ActionResult<string>> Get(int id) => Ok( await _context.Values.SingleOrDefaultAsync(c=>c.Id==id));
    }


}