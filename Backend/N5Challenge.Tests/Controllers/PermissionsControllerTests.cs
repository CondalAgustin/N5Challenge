using Xunit;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Elastic.Clients.Elasticsearch;
using Elastic.Transport;
using N5Challenge.Controllers;
using N5Challenge.N5.Permissions.Infrastructure;
using N5Challenge.N5.Permissions.Domain.Entities;
using N5Challenge.N5.Permissions.Application.DTOs;

namespace N5Challenge.Tests.Controllers
{
    public class PermissionsControllerTests
    {
        private PermissionsDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<PermissionsDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new PermissionsDbContext(options);
        }

        private ElasticsearchClient GetElasticClient()
        {
            var settings = new ElasticsearchClientSettings(new Uri("http://localhost:9200"))
                .DisableDirectStreaming()
                .Authentication(new ApiKey("dummy"));

            return new ElasticsearchClient(settings);
        }

        [Fact]
        public async Task GetPermissions_ReturnsOk()
        {
            var context = GetInMemoryDbContext();

            context.PermissionTypes.Add(new PermissionType
            {
                Id = 1,
                Descripcion = "Vacaciones"
            });

            await context.SaveChangesAsync();

            var controller = new PermissionsController(
                context,
                GetElasticClient()
            );

            var result = await controller.GetPermissions();

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task RequestPermission_ReturnsCreated()
        {
            var context = GetInMemoryDbContext();

            context.PermissionTypes.Add(new PermissionType
            {
                Id = 1,
                Descripcion = "Día de estudio"
            });

            await context.SaveChangesAsync();

            var controller = new PermissionsController(
                context,
                GetElasticClient()
            );

            var dto = new CreatePermissionDto
            {
                Nombre = "Luis",
                Apellido = "Figo",
                PermissionTypeId = 1
            };

            var result = await controller.RequestPermission(dto);

            Assert.IsType<CreatedAtActionResult>(result);
            Assert.Single(context.Permissions);
        }

        [Fact]
        public async Task ModifyPermission_ReturnsOk_WhenPermissionExists()
        {
            var context = GetInMemoryDbContext();

            var permission = new Permission
            {
                NombreEmpleado = "Juan",
                ApellidoEmpleado = "Perez",
                TipoPermisoId = 1,
                FechaPermiso = DateTime.UtcNow
            };

            context.Permissions.Add(permission);
            await context.SaveChangesAsync();

            var controller = new PermissionsController(
                context,
                GetElasticClient()
            );

            var dto = new UpdatePermissionDto
            {
                Nombre = "Juan Carlos",
                Apellido = "Perez",
                PermissionTypeId = 1
            };

            var result = await controller.ModifyPermission(permission.Id, dto);

            Assert.IsType<OkObjectResult>(result);

            var updated = await context.Permissions.FindAsync(permission.Id);
            Assert.Equal("Juan Carlos", updated.NombreEmpleado);
        }
    }
}
