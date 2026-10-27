const API_URL = process.env.PLAYWRIGHT_API_URL || 'http://localhost:8080/api'

export default async function globalSetup() {
  try {
    const respuesta = await fetch(`${API_URL}/espacios`)
    if (!respuesta.ok) {
      throw new Error(`respuesta ${respuesta.status}`)
    }
  } catch (error) {
    throw new Error(
      `El backend no esta disponible en ${API_URL} (${error.message}). ` +
      'Inicia el backend (./mvnw spring-boot:run en EntregableCesde) antes de correr las pruebas E2E.'
    )
  }
}
