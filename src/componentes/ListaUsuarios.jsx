import { usuarios } from "../services/datosUsuarios";
import { TarjetaUsuario } from "./TarjetaUsuario";

export function ListaUsuarios() {
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
            <section className="row g-4">
                {usuarios.map((usuario) => (
                    <div className="col-md-6 col-lg-4" key={usuario.id}>
                        <TarjetaUsuario usuario={usuario} />
                    </div>
                ))}
            </section>
        </main>
    )
}
