import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  CircularProgress,
  Box,
  Typography
} from '@mui/material'
import { useState, useEffect } from 'react'
import { requestPermission } from '../api/permissionsApi'
import { getPermissionTypes } from '../api/permissionTypesApi'

export default function PermissionForm({
  open,
  onClose,
  onSuccess,
  showSnackbar
}) {
  const [types, setTypes] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const initialFormState = {
    Nombre: '',
    Apellido: '',
    permissionTypeId: '',
  }

  const [form, setForm] = useState({
    Nombre: '',
    Apellido: '',
    permissionTypeId: '',
  })

  const resetForm = () => {
    setForm(initialFormState)
    setErrors({})
  }
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/

  const validateField = (name, value) => {
    switch (name) {
      case 'Nombre':
        if (!value.trim()) return 'El nombre es obligatorio'
        if (!nameRegex.test(value)) return 'Solo letras y espacios'
        return ''
      case 'Apellido':
        if (!value.trim()) return 'El apellido es obligatorio'
        if (!nameRegex.test(value)) return 'Solo letras y espacios'
        return ''
      case 'permissionTypeId':
        if (!value) return 'Debe seleccionar un tipo de permiso'
        return ''
      default:
        return ''
    }
  }

  const handleChange = e => {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value,
    }))

 
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    Object.keys(form).forEach(key => {
      const error = validateField(key, form[key])
      if (error) newErrors[key] = error
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await requestPermission(form)
      await onSuccess()
      showSnackbar('Permiso creado correctamente', 'success')
      onClose()
    } catch {
      showSnackbar('Error al crear el permiso', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadTypes = async () => {
      setLoading(true)
      const res = await getPermissionTypes()
      setTypes(res.data)
      setLoading(false)
    }

    if (open) loadTypes()
  }, [open])

  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          Request Permission
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <TextField
          label="Nombre"
          name="Nombre"
          fullWidth
          margin="normal"
          value={form.Nombre}
          onChange={handleChange}
          error={!!errors.Nombre}
          helperText={errors.Nombre}
        />

        <TextField
          label="Apellido"
          name="Apellido"
          fullWidth
          margin="normal"
          value={form.Apellido}
          onChange={handleChange}
          error={!!errors.Apellido}
          helperText={errors.Apellido}
        />

        <FormControl
          fullWidth
          margin="normal"
          error={!!errors.permissionTypeId}
        >
          <InputLabel>Tipo de permiso</InputLabel>
          <Select
            name="permissionTypeId"
            value={form.permissionTypeId}
            label="Tipo de permiso"
            onChange={handleChange}
          >
            {types.map(t => (
              <MenuItem key={t.id} value={t.id}>
                {t.descripcion}
              </MenuItem>
            ))}
          </Select>
          {errors.permissionTypeId && (
            <Typography variant="caption" color="error">
              {errors.permissionTypeId}
            </Typography>
          )}
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={22} /> : 'Save'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
