export const API_URL = process.env.PLAYWRIGHT_API_URL || 'http://localhost:8080/api'

export function emailUnico(prefijo) {
  return `${prefijo}-${Date.now()}-${Math.floor(Math.random() * 100000)}@playwright.test`
}

export async function registrarUsuarioApi(request, { nombre, correo, contrasena, rol }) {
  const res = await request.post(`${API_URL}/usuarios`, { data: { nombre, correo, contrasena, rol } })
  if (!res.ok()) {
    throw new Error(`No se pudo registrar el usuario de prueba (${res.status()}): ${await res.text()}`)
  }
  return res.json()
}

export async function crearEspacioApi(request, datos) {
  const res = await request.post(`${API_URL}/espacios`, { data: datos })
  if (!res.ok()) {
    throw new Error(`No se pudo crear el espacio de prueba (${res.status()}): ${await res.text()}`)
  }
  return res.json()
}

export async function listarReservasApi(request, token) {
  const res = await request.get(`${API_URL}/reservas`, { headers: { Authorization: `Bearer ${token}` } })
  return res.json()
}

export async function listarEspaciosApi(request) {
  const res = await request.get(`${API_URL}/espacios`)
  return res.json()
}

export async function eliminarConToken(request, ruta, token) {
  await request.delete(`${API_URL}${ruta}`, { headers: { Authorization: `Bearer ${token}` } })
}

export async function inyectarSesion(page, { token, usuario }) {
  await page.goto('/')
  await page.evaluate(({ token, usuario }) => {
    localStorage.setItem('paseoapp_sesion', JSON.stringify({ token, ...usuario }))
  }, { token, usuario })
}
