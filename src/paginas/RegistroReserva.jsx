import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PanelFormulario from '../componentes/PanelFormulario'
import { crearReserva } from '../services/reservaService'
import { listarEspacios } from '../services/espacioService'
import { obtenerSesion } from '../services/sesion'

const IMAGEN = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&q=80'
const HORA_APERTURA = '09:00'
const HORA_CIERRE = '22:00'

function RegistroReserva() {
  const navegar = useNavigate()
  const sesion = obtenerSesion()

  const [espacios, setEspacios] = useState([])
  const [reserva, setReserva] = useState({
    espacioId: '',
    fecha: '',
    hora: '',
  })
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (!sesion) {
      navegar('/')
      return
    }
    listarEspacios().then(setEspacios).catch((error) => setErrorServidor(error.message))
  }, [])

  if (!sesion) {
    return null
  }

  const manejarCambio = (evento) => {
    const { name, value } = evento.target
    setReserva({ ...reserva, [name]: value })
  }

  const validar = () => {
    const nuevosErrores = {}
    const hoy = new Date().toISOString().split('T')[0]
    if (reserva.espacioId === '') {
      nuevosErrores.espacioId = 'Selecciona un espacio'
    }
    if (reserva.fecha === '') {
      nuevosErrores.fecha = 'La fecha es obligatoria'
    } else if (reserva.fecha < hoy) {
      nuevosErrores.fecha = 'La fecha no puede ser anterior a hoy'
    }
    if (reserva.hora === '') {
      nuevosErrores.hora = 'La hora es obligatoria'
    } else if (reserva.hora < HORA_APERTURA || reserva.hora > HORA_CIERRE) {
      nuevosErrores.hora = 'Las reservas solo son validas entre las 9:00 a.m. y las 10:00 p.m.'
    }
    return nuevosErrores
  }

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    const nuevosErrores = validar()
    setErrores(nuevosErrores)
    setErrorServidor('')
    if (Object.keys(nuevosErrores).length === 0) {
      setEnviando(true)
      try {
        await crearReserva({ ...reserva, usuarioId: sesion.id })
        navegar('/reservas')
      } catch (error) {
        setErrorServidor(error.message)
      } finally {
        setEnviando(false)
      }
    }
  }

  return (
    <PanelFormulario
      imagen={IMAGEN}
      titulo="Aparta tu espacio"
      subtitulo="Elige la fecha y la hora, nosotros nos encargamos del resto."
      enlaceVolver="/home"
    >
      <h2 className="fw-bold mb-1">Nueva reserva</h2>
      <p className="text-muted mb-4">
        Reservando como <strong>{sesion.nombre}</strong>. Horario disponible: 9:00 a.m. a 10:00 p.m.,
        con al menos 5 horas de diferencia entre reservas del mismo espacio.
      </p>

      {errorServidor && <div className="alert alert-danger">{errorServidor}</div>}

      <form onSubmit={manejarEnvio} noValidate>
        <div className="mb-3">
          <label className="form-label fw-semibold">Espacio</label>
          <div className="input-group has-validation">
            <span className="input-group-text"><i className="bi bi-door-open"></i></span>
            <select
              name="espacioId"
              className={`form-select ${errores.espacioId ? 'is-invalid' : ''}`}
              value={reserva.espacioId}
              onChange={manejarCambio}
            >
              <option value="">Seleccione un espacio...</option>
              {espacios.map((espacio) => (
                <option key={espacio.id} value={espacio.id}>{espacio.nombre}</option>
              ))}
            </select>
            <div className="invalid-feedback">{errores.espacioId}</div>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Fecha</label>
          <div className="input-group has-validation">
            <span className="input-group-text"><i className="bi bi-calendar-event"></i></span>
            <input
              type="date"
              name="fecha"
              className={`form-control ${errores.fecha ? 'is-invalid' : ''}`}
              value={reserva.fecha}
              onChange={manejarCambio}
            />
            <div className="invalid-feedback">{errores.fecha}</div>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Hora</label>
          <div className="input-group has-validation">
            <span className="input-group-text"><i className="bi bi-clock"></i></span>
            <input
              type="time"
              name="hora"
              min={HORA_APERTURA}
              max={HORA_CIERRE}
              className={`form-control ${errores.hora ? 'is-invalid' : ''}`}
              value={reserva.hora}
              onChange={manejarCambio}
            />
            <div className="invalid-feedback">{errores.hora}</div>
          </div>
        </div>

        <button type="submit" className="btn btn-marca btn-lg w-100" disabled={enviando}>
          <i className="bi bi-calendar-check me-2"></i>{enviando ? 'Reservando...' : 'Confirmar reserva'}
        </button>
      </form>
    </PanelFormulario>
  )
}

export default RegistroReserva
