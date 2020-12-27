using Domain;
using Microsoft.EntityFrameworkCore;
using System;
using Microsoft.EntityFrameworkCore.Sqlite;

namespace Persistence
{
    public class DataContext:DbContext
    {
        public DataContext(DbContextOptions options):base(options)
        {
            
        }
        public DbSet<Value> Values { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Value>()
            .HasData(
                new Value{Id=1,Name="Moe1"},
                new Value{Id=2,Name="Moe2"},
                new Value{Id=3,Name="Moe3"}
            );
        }
    }  
}