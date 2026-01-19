import axios from 'axios'

const api = axios.create({
  baseURL: 'https://localhost:44388/api',  
})

export const getPermissions = () =>
  api.get('/Permissions')

export const requestPermission = (data) =>
  api.post('/Permissions', data)

export const modifyPermission = (id, data) =>
  api.put(`/Permissions/${id}`, data)
