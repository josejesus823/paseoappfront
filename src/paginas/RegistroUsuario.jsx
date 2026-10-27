import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PanelFormulario from '../componentes/PanelFormulario'
import { crearUsuario } from '../services/usuarioService'
import { guardarSesion } from '../services/sesion'

const IMAGEN = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=80'

function RegistroUsuario() {
  const navegar = useNavigate()

  const [usuario, setUsuario] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    rol: '',
  })
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [enviando, setEnviando] = useState(false)

  const manejarCambio = (evento) => {
    const { name, value } = evento.target
    setUsuario({ ...usuario, [name]: value })
  }

  const validar = () => {
    const nuevosErrores = {}
    if (usuario.nombre.trim() === '') {
      nuevosErrores.nombre = 'Los nombres son obligatorios'
    }
    if (!/^\S+@\S+\.\S+$/.test(usuario.correo)) {
      nuevosErrores.correo = 'Ingrese un correo válido'
    }
    if (usuario.contrasena.length < 6) {
      nuevosErrores.contrasena = 'La contraseña debe tener mínimo 6 caracteres'
    }
    if (usuario.rol === '') {
      nuevosErrores.rol = 'Seleccione un rol'
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
        const creado = await crearUsuario(usuario)
        guardarSesion(creado)
        navegar('/home')
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
      titulo="Tu unidad residencial, en un solo lugar"
      subtitulo="Reserva zonas comunes y administra los espacios de tu conjunto en Sabaneta."
      enlaceVolver="/"
    >
      <h2 className="fw-bold mb-1">Crear cuenta</h2>
      <p className="text-muted mb-4">Regístrate para empezar a reservar.</p>

      {errorServidor && <div className="alert alert-danger">{errorServidor}</div>}

      <form onSubmit={manejarEnvio} noValidate>
        <div className="mb-3">
          <label className="form-label fw-semibold">Nombres</label>
          <div className="input-group has-validation">
            <span className="input-group-text"><i className="bi bi-person"></i></span>
            <input
              type="text"
              name="nombre"
              placeholder="Juan Pérez"
              className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
              value={usuario.nombre}
              onChange={manejarCambio}
            />
            <div className="invalid-feedback">{errores.nombre}</div>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Correo</label>
          <div className="input-group has-validation">
            <span className="input-group-text"><i className="bi bi-envelope"></i></span>
            <input
              type="email"
              name="correo"
              placeholder="correo@ejemplo.com"
              className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
              value={usuario.correo}
              onChange={manejarCambio}
            />
            <div className="invalid-feedback">{errores.correo}</div>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Contraseña</label>
          <div className="input-group has-validation">
            <span className="input-group-text"><i className="bi bi-lock"></i></span>
            <input
              type="password"
              name="contrasena"
              placeholder="Mínimo 6 caracteres"
              className={`form-control ${errores.contrasena ? 'is-invalid' : ''}`}
              value={usuario.contrasena}
              onChange={manejarCambio}
            />
            <div className="invalid-feedback">{errores.contrasena}</div>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Rol</label>
          <div className="input-group has-validation">
            <span className="input-group-text"><i className="bi bi-shield-check"></i></span>
            <select
              name="rol"
              className={`form-select ${errores.rol ? 'is-invalid' : ''}`}
              value={usuario.rol}
              onChange={manejarCambio}
            >
              <option value="">Seleccione...</option>
              <option value="ADMINISTRADOR">Administrador</option>
              <option value="USUARIO">Usuario</option>
            </select>
            <div className="invalid-feedback">{errores.rol}</div>
          </div>
        </div>

        <button type="submit" className="btn btn-marca btn-lg w-100" disabled={enviando}>
          <i className="bi bi-box-arrow-in-right me-2"></i>{enviando ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </PanelFormulario>
  )
}

export default RegistroUsuario
