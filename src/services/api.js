import axios from 'axios'
import { obtenerSesion, cerrarSesion } from './sesion'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const sesion = obtenerSesion()
  if (sesion?.token) {
    config.headers.Authorization = `Bearer ${sesion.token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data
    let mensaje = data?.message || 'No se pudo completar la solicitud. Intenta nuevamente.'
    if (data?.errors) {
      mensaje = Object.values(data.errors)[0] || mensaje
    }
    if (error.response?.status === 401) {
      cerrarSesion()
      mensaje = 'Debes iniciar sesion de nuevo para continuar.'
    }
    if (!error.response) {
      mensaje = 'No fue posible conectar con el servidor. Verifica tu conexión.'
    }
    return Promise.reject(new Error(mensaje))
  }
)

export default api
