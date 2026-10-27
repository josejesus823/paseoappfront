import api from './api'

export async function listarEspacios() {
  const { data } = await api.get('/espacios')
  return data
}

export async function obtenerEspacio(id) {
  const { data } = await api.get(`/espacios/${id}`)
  return data
}

export async function crearEspacio(espacio) {
  const { data } = await api.post('/espacios', espacio)
  return data
}

export async function actualizarEspacio(id, espacio) {
  const { data } = await api.put(`/espacios/${id}`, espacio)
  return data
}

export async function eliminarEspacio(id) {
  await api.delete(`/espacios/${id}`)
}
