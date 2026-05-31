using API.Models;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // USERS
        public DbSet<User> Users { get; set; }

        // PROFILES
        public DbSet<StudentProfile> StudentProfiles { get; set; }

        public DbSet<Company> Companies { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Talent> Talents { get; set; }
        public DbSet<SavedTalent> SavedTalents { get; set; }
        public DbSet<FeedPost> FeedPosts { get; set; }
        public DbSet<Skill> Skills { get; set; }

        // ACTIVITIES
        public DbSet<Activity> Activities { get; set; }

        // TAGS
        public DbSet<Tag> Tags { get; set; }

        public DbSet<ActivityTag> ActivityTags { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // =========================================
            // ACTIVITY TAG (N:N)
            // =========================================

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

            // =========================================
            // USER -> STUDENT PROFILE (1:1)
            // =========================================

            modelBuilder.Entity<User>()
                .HasOne(u => u.StudentProfile)
                .WithOne(sp => sp.User)
                .HasForeignKey<StudentProfile>(sp => sp.UserId);

            modelBuilder.Entity<Talent>()
                .HasOne(t => t.User)
                .WithMany(u => u.Talents)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SavedTalent>()
                .HasOne(x => x.Company)
                .WithMany()
                .HasForeignKey(x => x.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SavedTalent>()
                .HasOne(x => x.Student)
                .WithMany()
                .HasForeignKey(x => x.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            // =========================================
            // COMPANY -> USER (1:1)
            // =========================================

            modelBuilder.Entity<Company>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}