import { espacios } from "../services/datosEspacios";
import { TarjetaEspacio } from "./TarjetaEspacios";

export function ListasEspacios() {

    return (
        <>
            <section className="row g-4">
                {
                    espacios.map((espacio) => (
                            <div className="col-md-4" key={espacio.id}>
                                <TarjetaEspacio espacio={espacio}/>
                            </div>
                    ))
                }

            </section>
        </>
    )

}