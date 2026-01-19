import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Box,
  TableContainer,
  Paper
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import EditPermissionModal from './EditPermissionModal.jsx'

export default function PermissionsTable({
  permissions,
  loadPermissions,
  showSnackbar
}) {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          backgroundColor: 'rgba(90, 70, 130, 0.04)',
        }}
      >
        <Table  >
          <TableHead sx={{
            backgroundColor: 'rgba(118, 94, 167, 0.1)',
          }}>
            <TableRow
              hover
              sx={{
                backgroundColor: 'rgba(90, 70, 130, 0.02)',
                '& td': {
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  py: 1.6,
                },
                '&:hover': {
                  backgroundColor: 'rgba(90, 70, 130, 0.08)',
                },
                transition: 'background-color 0.2s',
              }}
            >
              <TableCell sx={{ fontWeight: 700, py: 2 }}>
                Nombre empleado
              </TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>
                Apellido empleado
              </TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>
                Tipo de permiso
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, py: 2 }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {permissions.map(p => (
              <TableRow
                key={p.id}
                hover
                sx={{
                  transition: 'background-color 0.2s',
                }}
              >
                <TableCell>{p.nombreEmpleado}</TableCell>
                <TableCell>{p.apellidoEmpleado}</TableCell>
                <TableCell>{p.tipoPermisoDescripcion}</TableCell>

                <TableCell align="center">
                  <Tooltip title="Editar permiso">
                    <IconButton
                      onClick={() => setSelected(p)}
                      sx={{
                        backgroundColor: 'primary.main',
                        color: '#fff',
                        width: 32,
                        height: 32,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      }}
                      size="small"
                    >

                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {permissions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4,
                      color: 'text.secondary',
                    }}
                  >
                    No permissions found
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {selected && (
        <EditPermissionModal
          open={!!selected}
          permission={selected}
          onClose={() => setSelected(null)}
          onSuccess={loadPermissions}
          showSnackbar={showSnackbar}
        />
      )}
    </>
  )
}
