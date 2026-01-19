using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using N5Challenge.N5.Permissions.Infrastructure;
using N5Challenge.N5.Permissions.Domain.Entities;
using N5Challenge.N5.Permissions.Application.DTOs;
using Elastic.Clients.Elasticsearch;

namespace N5Challenge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PermissionsController : ControllerBase
    {
        private readonly PermissionsDbContext _context;
        private readonly ElasticsearchClient _elasticClient;
        public PermissionsController(
             PermissionsDbContext context,
             ElasticsearchClient elasticClient)
        {
            _context = context;
            _elasticClient = elasticClient;
        }

        [HttpGet]
        public async Task<IActionResult> GetPermissions()
        {
            var response = await _elasticClient.SearchAsync<PermissionElasticDto>(s => s
                .Index("permissions")
                .Size(100)
            );

            if (response == null || !response.IsValidResponse)
            {
                return Ok(new List<object>());
            }

            var permissions = response.Hits?
                .Where(h => h.Source != null)
                .Select(h => h.Source)
                .ToList()
                ?? new List<PermissionElasticDto>();

            if (!permissions.Any())
            {
                return Ok(new List<object>());
            }

            if (_context == null)
            {
                return StatusCode(500, "DbContext no inicializado");
            }

            var tipoPermisos = await _context.PermissionTypes
                .ToDictionaryAsync(tp => tp.Id, tp => tp.Descripcion);

            var result = permissions.Select(p => new
            {
                p.Id,
                p.NombreEmpleado,
                p.ApellidoEmpleado,
                p.TipoPermisoId,
                TipoPermisoDescripcion = tipoPermisos.TryGetValue(p.TipoPermisoId, out var desc)
                    ? desc
                    : null,
                p.FechaPermiso
            });

            return Ok(result);
        }





        [HttpPost]
        public async Task<IActionResult> RequestPermission(CreatePermissionDto dto)
        {
            var permission = new Permission
            {
                NombreEmpleado = dto.Nombre,
                ApellidoEmpleado = dto.Apellido,
                TipoPermisoId = dto.PermissionTypeId,
                FechaPermiso = DateTime.UtcNow
            };

            _context.Permissions.Add(permission);
            await _context.SaveChangesAsync();

            var permissionType = await _context.PermissionTypes
                .Where(pt => pt.Id == permission.TipoPermisoId)
                .Select(pt => pt.Descripcion)
                .FirstAsync();

            var elasticDoc = new PermissionElasticDto
            {
                Id = permission.Id,
                NombreEmpleado = permission.NombreEmpleado,
                ApellidoEmpleado = permission.ApellidoEmpleado,
                TipoPermisoId = permission.TipoPermisoId,
                FechaPermiso = permission.FechaPermiso
            };

            var indexExists = await _elasticClient.Indices.ExistsAsync("permissions");

            if (!indexExists.Exists)
            {
                await _elasticClient.Indices.CreateAsync("permissions");
            }


            await _elasticClient.IndexAsync(elasticDoc, i => i
                .Index("permissions")
                .Refresh(Refresh.WaitFor)
            );

            return CreatedAtAction(nameof(GetPermissions), new { id = permission.Id }, permission);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> ModifyPermission(int id, UpdatePermissionDto dto)
        {
            var permission = await _context.Permissions.FindAsync(id);

            if (permission == null)
                return NotFound();

            permission.NombreEmpleado = dto.Nombre;
            permission.ApellidoEmpleado = dto.Apellido;
            permission.TipoPermisoId = dto.PermissionTypeId;

            await _context.SaveChangesAsync();

          
            var elasticDoc = new PermissionElasticDto
            {
                Id = permission.Id,
                NombreEmpleado = permission.NombreEmpleado,
                ApellidoEmpleado = permission.ApellidoEmpleado,
                TipoPermisoId = permission.TipoPermisoId,
                FechaPermiso = permission.FechaPermiso
            };

            await _elasticClient.IndexAsync(elasticDoc, i => i
                .Index("permissions")
                .Id(permission.Id)
                .Refresh(Refresh.True)
            );

            return Ok(permission);
        }

    }
}
