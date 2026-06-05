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
        public DbSet<Trajectory> Trajectories { get; set; }

        // ACTIVITIES
        public DbSet<Activity> Activities { get; set; }


        // TAGS
        public DbSet<Tag> Tags { get; set; }
        public DbSet<ActivityTag> ActivityTags { get; set; }

        // CANDIDATURAS E NOTIFICAÇÕES
        public DbSet<JobApplication> JobApplications { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        // CHAT
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<ConversationParticipant> ConversationParticipants { get; set; }
        public DbSet<Message> Messages { get; set; }

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


            modelBuilder.Entity<Trajectory>(entity =>
            {
                entity.HasKey(t => t.Id);

                entity.HasOne(t => t.User)
                    .WithMany() // ou .WithMany(u => u.Trajectories) se quiser navegação
                    .HasForeignKey(t => t.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(t => t.FeedPost)
                    .WithMany()
                    .HasForeignKey(t => t.FeedPostId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .IsRequired(false);
            });

            // =========================================
            // COMPANY -> USER (1:1)
            // =========================================

            modelBuilder.Entity<Company>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // AppDbContext.cs
            modelBuilder.Entity<User>()
                .HasOne(u => u.CompanyProfile)
                .WithOne(c => c.User)
                .HasForeignKey<Company>(c => c.UserId);
            // =========================================
            // JOB APPLICATION (N:N — Aluno x Vaga)
            // =========================================

            modelBuilder.Entity<JobApplication>()
                .HasOne(ja => ja.Job)
                .WithMany()
                .HasForeignKey(ja => ja.JobId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<JobApplication>()
                .HasOne(ja => ja.StudentUser)
                .WithMany()
                .HasForeignKey(ja => ja.StudentUserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Impede candidatura duplicada
            modelBuilder.Entity<JobApplication>()
                .HasIndex(ja => new { ja.JobId, ja.StudentUserId })
                .IsUnique();

            // =========================================
            // NOTIFICATION
            // =========================================

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Company)
                .WithMany()
                .HasForeignKey(n => n.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Job)
                .WithMany()
                .HasForeignKey(n => n.JobId)
                .OnDelete(DeleteBehavior.Restrict); // Não deleta notificação se deletar vaga

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.StudentUser)
                .WithMany()
                .HasForeignKey(n => n.StudentUserId)
                .OnDelete(DeleteBehavior.Cascade);

            // =========================================
            // CONVERSATION PARTICIPANT (N:N)
            // =========================================

            modelBuilder.Entity<ConversationParticipant>()
                .HasKey(cp => new { cp.ConversationId, cp.UserId });

            modelBuilder.Entity<ConversationParticipant>()
                .HasOne(cp => cp.Conversation)
                .WithMany(c => c.Participants)
                .HasForeignKey(cp => cp.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ConversationParticipant>()
                .HasOne(cp => cp.User)
                .WithMany(u => u.ConversationParticipants)
                .HasForeignKey(cp => cp.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // =========================================
            // MESSAGE
            // =========================================

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Conversation)
                .WithMany(c => c.Messages)
                .HasForeignKey(m => m.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(u => u.SentMessages)
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}