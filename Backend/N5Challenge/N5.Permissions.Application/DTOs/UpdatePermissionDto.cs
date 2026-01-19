using System.ComponentModel.DataAnnotations;

namespace N5Challenge.N5.Permissions.Application.DTOs
{
    public class UpdatePermissionDto
    {
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$")]
        public string Nombre { get; set; }

        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$")]
        public string Apellido { get; set; }
        public int PermissionTypeId { get; set; }
    }
}
