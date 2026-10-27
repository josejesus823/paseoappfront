const CLAVE_SESION = 'paseoapp_sesion'

export function guardarSesion({ token, usuario }) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify({ token, ...usuario }))
}

export function obtenerSesion() {
  try {
    const datos = localStorage.getItem(CLAVE_SESION)
    return datos ? JSON.parse(datos) : null
  } catch {
    return null
  }
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION)
}

export function esAdministrador() {
  return obtenerSesion()?.rol === 'ADMINISTRADOR'
}
