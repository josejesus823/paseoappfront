import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegistroUsuario from './paginas/RegistroUsuario'
import Home from './paginas/Home'
import RegistroEspacio from './paginas/RegistroEspacio'
import RegistroReserva from './paginas/RegistroReserva'
import { ListasEspacios } from './componentes/ListaEspacios'
import { ListaReserva } from './componentes/ListaReserva'
import { ListaUsuarios } from './componentes/ListaUsuarios'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegistroUsuario />} />
        <Route path="/home" element={<Home />} />
        <Route path="/espacios" element={<ListasEspacios />} />
        <Route path="/registrar-espacio" element={<RegistroEspacio />} />
        <Route path="/reservas" element={<ListaReserva />} />
        <Route path="/registrar-reserva" element={<RegistroReserva />} />
        <Route path="/usuarios" element={<ListaUsuarios />} />
        <Route path="/listaEspacios" element={<ListasEspacios />} />
        <Route path="/espacios" element={<RegistroEspacio />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
