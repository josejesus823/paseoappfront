export function TarjetaEspacio({espacio}){
    return(
        <>
        <section className="card p-4 shadow h-100">
            <img
                src={espacio.foto || "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80"}
                alt={espacio.nombre}
                className="card-img-top mb-3"
            />
            <h5 className="card-title fw-bold">{espacio.nombre}</h5>
            <p className="text-muted">{espacio.descripcion}</p>
            <h3>Aforo: {espacio.aforo}</h3>

        </section>
        </>
    )
}