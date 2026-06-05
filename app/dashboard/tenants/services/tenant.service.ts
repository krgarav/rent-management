import axios from 'axios'

export const getTenants = async () => {
  const { data } = await axios.get('/api/tenants')
  return data
}

export const deleteTenant = async (id: string) => {
  await axios.delete(`/api/tenants/${id}`)
}