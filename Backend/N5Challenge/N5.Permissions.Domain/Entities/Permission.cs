namespace N5Challenge.N5.Permissions.Domain.Entities
{
    public class Permission
    {
        public int Id { get; set; }

        public string NombreEmpleado { get; set; } = null!;
        public string ApellidoEmpleado { get; set; } = null!;
        public int TipoPermisoId { get; set; }

        public DateTime FechaPermiso { get; set; }
    }
}
