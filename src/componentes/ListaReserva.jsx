import { reservas } from "../services/datosReserva";
import { TarjetaReserva } from "./TarjetaReserva";

export function ListaReserva() {
    return (
        <main className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold mb-1">Reservas</h1>
                    <p className="text-muted mb-0">Consulta las reservas registradas.</p>
                </div>
                <a href="/home" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-1"></i>Inicio
                </a>
            </div>
            <section className="row g-4">
                {reservas.map((reserva) => (
                    <div className="col-md-6 col-lg-4" key={reserva.id}>
                        <TarjetaReserva reserva={reserva} />
                    </div>
                ))}
            </section>
        </main>
    )
}
