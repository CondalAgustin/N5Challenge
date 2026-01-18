namespace N5Challenge.N5.Permissions.Application.DTOs
{
    public class PermissionElasticDto
    {
        public int Id { get; set; }
        public string NombreEmpleado { get; set; } = null!;
        public string ApellidoEmpleado { get; set; } = null!;
        public int TipoPermisoId { get; set; }
        public string TipoPermisoDescripcion { get; set; } = null!;
        public DateTime FechaPermiso { get; set; }
    }
}
