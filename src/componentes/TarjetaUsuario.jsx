export function TarjetaUsuario({ usuario }) {
    return (
        <article className="card p-4 shadow h-100">
            <div className="d-flex align-items-center gap-3 mb-3">
                <i className="bi bi-person-circle fs-2 texto-marca"></i>
                <h5 className="card-title fw-bold mb-0">{usuario.nombre}</h5>
            </div>
            <p className="mb-2">
                <i className="bi bi-envelope me-2 texto-marca"></i>
                {usuario.correo}
            </p>
            <span className="badge text-bg-secondary align-self-start">{usuario.rol}</span>
        </article>
    )
}
