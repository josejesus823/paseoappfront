import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarEspacios } from '../services/espacioService'
import { TarjetaEspacio } from './TarjetaEspacio'

export function ListasEspacios() {
    const [espacios, setEspacios] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        listarEspacios()
            .then(setEspacios)
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false))
    }, [])

    return (
        <main className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold mb-1">Espacios</h1>
                    <p className="text-muted mb-0">Consulta las zonas comunes disponibles.</p>
                </div>
                <div className="d-flex gap-2">
                    <Link to="/registrar-espacio" className="btn btn-marca">
                        <i className="bi bi-plus-circle me-1"></i>Nuevo espacio
                    </Link>
                    <Link to="/home" className="btn btn-outline-secondary">
                        <i className="bi bi-arrow-left me-1"></i>Inicio
                    </Link>
                </div>
            </div>

            {cargando && <p className="text-muted">Cargando espacios...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!cargando && !error && espacios.length === 0 && (
                <p className="text-muted">Todavia no hay espacios registrados.</p>
            )}

            <section className="row g-4">
                {espacios.map((espacio) => (
                    <div className="col-md-4" key={espacio.id}>
                        <TarjetaEspacio espacio={espacio} />
                    </div>
                ))}
            </section>
        </main>
    )
}
