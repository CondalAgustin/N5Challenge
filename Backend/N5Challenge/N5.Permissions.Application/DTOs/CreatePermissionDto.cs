using System.ComponentModel.DataAnnotations;

namespace N5Challenge.N5.Permissions.Application.DTOs
{
    public class CreatePermissionDto
    {
        

        [Required]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$")]
        public string Nombre { get; set; }

        [Required]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$")]
        public string Apellido { get; set; }

        [Required]
        public int PermissionTypeId { get; set; }
    }
}
