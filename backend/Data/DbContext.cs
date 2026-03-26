using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // Aqui você representa suas tabelas
        public DbSet<Activity> Activities { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Aqui você configura regras mais avançadas (opcional no início)

            modelBuilder.Entity<Activity>()
                .HasKey(u => u.Id);

            modelBuilder.Entity<User>()
                .HasKey(h => h.Id);
        }
    }
}