import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PanelFormulario from '../componentes/PanelFormulario'
import { iniciarSesion } from '../services/usuarioService'
import { guardarSesion } from '../services/sesion'

const IMAGEN = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=80'

function Login() {
  const navegar = useNavigate()

  const [credenciales, setCredenciales] = useState({ correo: '', contrasena: '' })
  const [errorServidor, setErrorServidor] = useState('')
  const [enviando, setEnviando] = useState(false)

  const manejarCambio = (evento) => {
    const { name, value } = evento.target
    setCredenciales({ ...credenciales, [name]: value })
  }

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    setErrorServidor('')
    setEnviando(true)
    try {
      const usuario = await iniciarSesion(credenciales)
      guardarSesion(usuario)
      navegar('/home')
    } catch (error) {
      setErrorServidor(error.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <PanelFormulario
      imagen={IMAGEN}
      titulo="Tu unidad residencial, en un solo lugar"
      subtitulo="Inicia sesión para reservar o administrar las zonas comunes."
    >
      <h2 className="fw-bold mb-1">Iniciar sesión</h2>
      <p className="text-muted mb-4">Ingresa con tu correo y contraseña.</p>

      {errorServidor && <div className="alert alert-danger">{errorServidor}</div>}

      <form onSubmit={manejarEnvio} noValidate>
        <div className="mb-3">
          <label className="form-label fw-semibold">Correo</label>
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-envelope"></i></span>
            <input
              type="email"
              name="correo"
              placeholder="correo@ejemplo.com"
              className="form-control"
              value={credenciales.correo}
              onChange={manejarCambio}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Contraseña</label>
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-lock"></i></span>
            <input
              type="password"
              name="contrasena"
              placeholder="Tu contraseña"
              className="form-control"
              value={credenciales.contrasena}
              onChange={manejarCambio}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-marca btn-lg w-100" disabled={enviando}>
          <i className="bi bi-box-arrow-in-right me-2"></i>{enviando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p className="text-center text-muted mt-4 mb-0">
        ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
      </p>
    </PanelFormulario>
  )
}

export default Login
