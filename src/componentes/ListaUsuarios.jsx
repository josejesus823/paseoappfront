import { useEffect, useState } from 'react'
import { listarUsuarios, eliminarUsuario } from '../services/usuarioService'
import { esAdministrador } from '../services/sesion'
import { TarjetaUsuario } from './TarjetaUsuario'

export function ListaUsuarios() {
    const [usuarios, setUsuarios] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const puedeEliminar = esAdministrador()

    const cargar = () => {
        setCargando(true)
        listarUsuarios()
            .then(setUsuarios)
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false))
    }

    useEffect(() => {
        cargar()
    }, [])

    const manejarEliminar = async (id) => {
        if (!window.confirm('¿Eliminar este usuario?')) return
        setError('')
        try {
            await eliminarUsuario(id)
            cargar()
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <main className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold mb-1">Usuarios</h1>
                    <p className="text-muted mb-0">Consulta los usuarios registrados.</p>
                </div>
                <a href="/home" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-1"></i>Inicio
                </a>
            </div>

            {cargando && <p className="text-muted">Cargando usuarios...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!cargando && !error && usuarios.length === 0 && (
                <p className="text-muted">Todavia no hay usuarios registrados.</p>
            )}

            <section className="row g-4">
                {usuarios.map((usuario) => (
                    <div className="col-md-6 col-lg-4" key={usuario.id}>
                        <TarjetaUsuario usuario={usuario} />
                        {puedeEliminar && (
                            <button
                                className="btn btn-outline-danger btn-sm w-100 mt-2"
                                onClick={() => manejarEliminar(usuario.id)}
                            >
                                <i className="bi bi-trash me-1"></i>Eliminar
                            </button>
                        )}
                    </div>
                ))}
            </section>
        </main>
    )
}
