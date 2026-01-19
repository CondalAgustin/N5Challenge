using Microsoft.AspNetCore.Mvc;
using N5Challenge.N5.Permissions.Domain.Entities;
using N5Challenge.N5.Permissions.Infrastructure;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class PermissionTypesController : ControllerBase
{
    private readonly PermissionsDbContext _context;

    public PermissionTypesController(PermissionsDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var types = await _context.PermissionTypes
            .Select(t => new PermissionType
            {
                Id = t.Id,
                Descripcion = t.Descripcion
            })
            .ToListAsync();

        return Ok(types);
    }
}
