import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Paper
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PermissionsTable from '../components/PermissionsTable'
import PermissionForm from '../components/PermissionForm'
import { getPermissions } from '../api/permissionsApi'
import AppSnackbar from '../components/AppSnackbar'
import { keyframes } from '@mui/system'

export default function Home() {
  const [openForm, setOpenForm] = useState(false)
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  const loadPermissions = async () => {
    setLoading(true)
    try {
      const res = await getPermissions()
      setPermissions(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPermissions()
  }, [])

  const slideFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`


  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>


      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box
          sx={{
            animation: `${slideFadeIn} 1.9s ease-out`,
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              background: 'linear-gradient(90deg, #862036 0%, #5c0526 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: 0.4,
              filter: 'drop-shadow(3px 9px 1px rgba(121, 13, 28, 0.3))',
              paddingBottom: '4px',
            }}
          >
            N5 Challenge
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Sistema de gestión de permisos
          </Typography>
        </Box>


        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
          sx={{
            px: 3,
            py: 1.2,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Request Permission
        </Button>
      </Box>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <PermissionsTable
            permissions={permissions}
            loadPermissions={loadPermissions}
            showSnackbar={showSnackbar}
          />
        )}
      </Paper>

      <PermissionForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={loadPermissions}
        showSnackbar={showSnackbar}
      />

      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Container>
  )
}
