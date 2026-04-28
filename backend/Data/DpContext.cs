using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Activity> Activities { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<ActivityTag> ActivityTags { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ActivityTag>()
                .HasKey(at => new { at.ActivityId, at.TagId });

            modelBuilder.Entity<ActivityTag>()
                .HasOne(at => at.Activity)
                .WithMany(a => a.ActivityTags)
                .HasForeignKey(at => at.ActivityId);

            modelBuilder.Entity<ActivityTag>()
                .HasOne(at => at.Tag)
                .WithMany(t => t.ActivityTags)
                .HasForeignKey(at => at.TagId);
        }
    }
}