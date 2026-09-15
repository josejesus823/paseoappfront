export function TarjetaReserva({ reserva }) {
    return (
        <article className="card p-4 shadow h-100">
            <div className="d-flex align-items-center gap-3 mb-3">
                <i className="bi bi-calendar-check fs-2 texto-marca"></i>
                <h5 className="card-title fw-bold mb-0">Reserva #{reserva.id}</h5>
            </div>
            <p className="mb-2">
                <i className="bi bi-calendar-event me-2 texto-marca"></i>
                <strong>Fecha:</strong> {reserva.fecha}
            </p>
            <p className="mb-0">
                <i className="bi bi-clock me-2 texto-marca"></i>
                <strong>Hora:</strong> {reserva.hora}
            </p>
        </article>
    )
}
