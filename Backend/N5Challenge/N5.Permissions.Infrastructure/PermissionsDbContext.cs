using Microsoft.EntityFrameworkCore;
using N5Challenge.N5.Permissions.Domain.Entities;

namespace N5Challenge.N5.Permissions.Infrastructure
{
    public class PermissionsDbContext : DbContext
    {
        public PermissionsDbContext(DbContextOptions<PermissionsDbContext> options)
            : base(options)
        {
        }

        public DbSet<Permission> Permissions => Set<Permission>();
        public DbSet<PermissionType> PermissionTypes => Set<PermissionType>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Permission>(entity =>
            {
                entity.HasKey(p => p.Id);

                entity.Property(p => p.NombreEmpleado)
                      .IsRequired();

                entity.Property(p => p.ApellidoEmpleado)
                      .IsRequired();

                entity.Property(p => p.FechaPermiso)
                      .IsRequired();

                entity.Property(p => p.TipoPermisoId)
                      .IsRequired();
            });

            modelBuilder.Entity<PermissionType>(entity =>
            {
                entity.HasKey(pt => pt.Id);

                entity.Property(pt => pt.Descripcion)
                      .IsRequired();
            });

            modelBuilder.Entity<PermissionType>().HasData(
                new PermissionType { Id = 1, Descripcion = "Vacaciones" },
                new PermissionType { Id = 2, Descripcion = "Licencia médica" },
                new PermissionType { Id = 3, Descripcion = "Licencia personal" },
                new PermissionType { Id = 4, Descripcion = "Licencia por estudios" },
                new PermissionType { Id = 5, Descripcion = "Licencia por maternidad" },
                new PermissionType { Id = 6, Descripcion = "Licencia por matrimonio" }


               );
        }
    }
}
