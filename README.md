# Paseo App — Frontend (paseoappfront)

SPA en React para reservar y administrar las zonas comunes de una unidad residencial. Consume la API REST del backend en [`../EntregableCesde`](../EntregableCesde).

**Integrantes:** Ana Sofía Muñoz · Jose Jesus Vargas

## Stack

- React 19 + React Router 7
- Vite 8 (dev server y build)
- Bootstrap 5 + Bootstrap Icons
- Axios (cliente HTTP con interceptores de autenticación y errores)
- Playwright (pruebas end-to-end)

## Estructura del código

```
src/
├── App.jsx            Rutas de la aplicación
├── main.jsx           Punto de entrada
├── paginas/           Páginas (una por ruta): Login, RegistroUsuario, Home,
│                       RegistroEspacio, RegistroReserva
├── componentes/        Componentes reutilizables y las vistas de listado
│                       (ListaEspacios, ListaReserva, ListaUsuarios, Tarjetas, PanelFormulario)
└── services/
    ├── api.js          Instancia de axios: adjunta el JWT y normaliza errores
    ├── sesion.js        Maneja la sesión del usuario en localStorage
    ├── usuarioService.js
    ├── espacioService.js
    └── reservaService.js
e2e/                    Pruebas end-to-end con Playwright
```

## Rutas

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Login | Público |
| `/registro` | Crear cuenta | Público |
| `/home` | Portada | Público |
| `/espacios` | Lista de espacios | Público |
| `/registrar-espacio` | Nuevo espacio | Público |
| `/reservas` | Lista de reservas | Público (botón "Eliminar" visible para administradores y para el dueño de cada reserva) |
| `/registrar-reserva` | Nueva reserva | Requiere sesión (redirige a `/` si no hay sesión) |
| `/usuarios` | Lista de usuarios | Público (botón "Eliminar" solo visible para administradores) |

## Requisitos previos

- Node.js 18+
- El backend corriendo (ver [`../EntregableCesde/README.md`](../EntregableCesde/README.md)); por defecto en `http://localhost:8080`.

## Configuración

La URL del backend se define por variable de entorno (Vite), para poder desplegar el frontend contra cualquier servidor sin cambiar código:

- `.env.development` → `VITE_API_URL=http://localhost:8080/api` (ya incluido, para desarrollo local)
- `.env.production` → cambia `VITE_API_URL` por la URL real del backend en producción antes de hacer `npm run build`

## Cómo correrlo

```bash
npm install
npm run dev
```

Queda disponible en `http://localhost:5173`.

Otros comandos:

```bash
npm run build     # build de producción en dist/
npm run preview   # sirve el build de produccion localmente
npm run lint      # oxlint
```

## Autenticación

- Al iniciar sesión o registrarse, el backend responde con un JWT que se guarda en `localStorage` junto con los datos del usuario (`services/sesion.js`).
- `services/api.js` adjunta automáticamente `Authorization: Bearer <token>` en cada petición si hay sesión activa, y si el backend responde `401` (token inválido o expirado), cierra la sesión localmente.
- El botón "Eliminar" en usuarios solo lo ve un `ADMINISTRADOR`. En reservas lo ve un `ADMINISTRADOR` **o el usuario dueño de esa reserva puntual** — aunque el frontend decida cuándo mostrarlo, el backend siempre revalida el rol y la propiedad en cada petición de borrado.

## Pruebas end-to-end (Playwright)

Las pruebas abren un navegador real, usan la interfaz (registro, login, formularios) y verifican contra el backend real las 4 reglas de negocio de las reservas y los permisos de administrador. Cada prueba crea sus propios datos (correos únicos) y los elimina al finalizar usando una cuenta administradora de prueba, sin tocar los datos reales de la aplicación.

**Requisito:** el backend debe estar corriendo en `http://localhost:8080` (si no lo está, las pruebas fallan de inmediato con un mensaje claro en vez de colgarse).

```bash
npx playwright install chromium   # solo la primera vez
npm run test:e2e                  # corre toda la suite en consola
npm run test:e2e:ui               # modo visual/interactivo
```

Suite actual (`e2e/`):

- `registro-login.spec.js` — registro, login, credenciales inválidas, logout.
- `espacios.spec.js` — creación de un espacio y validación de campos obligatorios.
- `reservas.spec.js` — horario válido (9 a. m.–10 p. m.), separación de 5 horas entre reservas del mismo espacio, límite exacto de 5 horas, una sola reserva activa por usuario, y redirección a login sin sesión.
- `admin-permisos.spec.js` — el botón "Eliminar" de usuarios solo aparece y funciona para el rol `ADMINISTRADOR`.
- `propia-reserva.spec.js` — un usuario normal solo ve y puede usar "Eliminar" en su propia reserva (no en las de otros), y el backend rechaza con `403` el intento de borrar la reserva de otro por API directa.
