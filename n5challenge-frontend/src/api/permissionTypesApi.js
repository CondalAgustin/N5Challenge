import axios from 'axios'

export const getPermissionTypes = () => {
  return axios.get('https://localhost:44388/api/PermissionTypes')
}
