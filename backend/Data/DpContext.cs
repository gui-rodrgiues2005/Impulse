using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        // Construtor
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // Tabelas
        public DbSet<Activity> Activities { get; set; }
        public DbSet<User> Users { get; set; }
    }
}