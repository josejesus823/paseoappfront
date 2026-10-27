import { useEffect, useState } from 'react'
import { listarReservas, eliminarReserva } from '../services/reservaService'
import { obtenerSesion } from '../services/sesion'
import { TarjetaReserva } from './TarjetaReserva'

export function ListaReserva() {
    const [reservas, setReservas] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const sesion = obtenerSesion()

    const puedeEliminar = (reserva) =>
        sesion && (sesion.rol === 'ADMINISTRADOR' || reserva.usuario?.id === sesion.id)

    const cargar = () => {
        setCargando(true)
        listarReservas()
            .then(setReservas)
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false))
    }

    useEffect(() => {
        cargar()
    }, [])

    const manejarEliminar = async (id) => {
        if (!window.confirm('¿Eliminar esta reserva?')) return
        setError('')
        try {
            await eliminarReserva(id)
            cargar()
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <main className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold mb-1">Reservas</h1>
                    <p className="text-muted mb-0">Consulta las reservas registradas.</p>
                </div>
                <div className="d-flex gap-2">
                    <a href="/registrar-reserva" className="btn btn-marca">
                        <i className="bi bi-calendar-plus me-1"></i>Nueva reserva
                    </a>
                    <a href="/home" className="btn btn-outline-secondary">
                        <i className="bi bi-arrow-left me-1"></i>Inicio
                    </a>
                </div>
            </div>

            {cargando && <p className="text-muted">Cargando reservas...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!cargando && !error && reservas.length === 0 && (
                <p className="text-muted">Todavia no hay reservas registradas.</p>
            )}

            <section className="row g-4">
                {reservas.map((reserva) => (
                    <div className="col-md-6 col-lg-4" key={reserva.id}>
                        <TarjetaReserva reserva={reserva} />
                        {puedeEliminar(reserva) && (
                            <button
                                className="btn btn-outline-danger btn-sm w-100 mt-2"
                                onClick={() => manejarEliminar(reserva.id)}
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
