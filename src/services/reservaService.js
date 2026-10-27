import api from './api'

export async function listarReservas() {
  const { data } = await api.get('/reservas')
  return data
}

export async function obtenerReserva(id) {
  const { data } = await api.get(`/reservas/${id}`)
  return data
}

export async function crearReserva(reserva) {
  const { data } = await api.post('/reservas', reserva)
  return data
}

export async function actualizarReserva(id, reserva) {
  const { data } = await api.put(`/reservas/${id}`, reserva)
  return data
}

export async function eliminarReserva(id) {
  await api.delete(`/reservas/${id}`)
}
