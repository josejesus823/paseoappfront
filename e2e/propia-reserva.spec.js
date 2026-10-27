import { test, expect } from '@playwright/test'
import {
  emailUnico,
  registrarUsuarioApi,
  crearEspacioApi,
  eliminarConToken,
  inyectarSesion,
  listarReservasApi,
  API_URL,
} from './utils/api'

test.describe('Un usuario solo puede eliminar su propia reserva', () => {
  let adminToken
  let adminId
  let espacio
  const usuariosCreados = []
  const reservasCreadas = []

  test.beforeAll(async ({ request }) => {
    const admin = await registrarUsuarioApi(request, {
      nombre: 'Admin Propia Reserva QA', correo: emailUnico('admin-propia'), contrasena: '123456', rol: 'ADMINISTRADOR',
    })
    adminToken = admin.token
    adminId = admin.usuario.id
    espacio = await crearEspacioApi(request, {
      nombre: `Espacio Propia Reserva QA ${Date.now()}`,
      descripcion: 'Espacio generado para pruebas de propiedad de reservas',
      foto: '',
      aforo: 10,
    })
  })

  test.afterAll(async ({ request }) => {
    for (const id of reservasCreadas) {
      await eliminarConToken(request, `/reservas/${id}`, adminToken)
    }
    await eliminarConToken(request, `/espacios/${espacio.id}`, adminToken)
    for (const id of usuariosCreados) {
      await eliminarConToken(request, `/usuarios/${id}`, adminToken)
    }
    await eliminarConToken(request, `/usuarios/${adminId}`, adminToken)
  })

  test('un usuario normal ve el boton Eliminar solo en su propia reserva', async ({ page, request }) => {
    const propietario = await registrarUsuarioApi(request, {
      nombre: 'Propietario Reserva', correo: emailUnico('propietario'), contrasena: '123456', rol: 'USUARIO',
    })
    const otro = await registrarUsuarioApi(request, {
      nombre: 'Otro Usuario', correo: emailUnico('otro'), contrasena: '123456', rol: 'USUARIO',
    })
    usuariosCreados.push(propietario.usuario.id, otro.usuario.id)

    await inyectarSesion(page, propietario)
    await page.goto('/registrar-reserva')
    await page.locator('select[name="espacioId"]').selectOption(espacio.id)
    await page.locator('input[name="fecha"]').fill('2027-06-01')
    await page.locator('input[name="hora"]').fill('09:00')
    await page.getByRole('button', { name: 'Confirmar reserva' }).click()
    await expect(page).toHaveURL(/\/reservas$/)

    const lista = await listarReservasApi(request, adminToken)
    const creada = lista.find((r) => r.usuario.id === propietario.usuario.id && r.fecha === '2027-06-01')
    expect(creada).toBeTruthy()
    reservasCreadas.push(creada.id)

    await inyectarSesion(page, otro)
    await page.goto('/reservas')
    const filaDeOtro = page.locator('.col-md-6.col-lg-4', { hasText: 'Propietario Reserva' })
    await expect(filaDeOtro.getByRole('button', { name: 'Eliminar' })).toHaveCount(0)
  })

  test('el propietario puede eliminar su reserva desde la lista', async ({ page, request }) => {
    const propietario = await registrarUsuarioApi(request, {
      nombre: 'Dueño Borra Reserva', correo: emailUnico('dueno'), contrasena: '123456', rol: 'USUARIO',
    })
    usuariosCreados.push(propietario.usuario.id)

    await inyectarSesion(page, propietario)
    await page.goto('/registrar-reserva')
    await page.locator('select[name="espacioId"]').selectOption(espacio.id)
    await page.locator('input[name="fecha"]').fill('2027-06-02')
    await page.locator('input[name="hora"]').fill('09:00')
    await page.getByRole('button', { name: 'Confirmar reserva' }).click()
    await expect(page).toHaveURL(/\/reservas$/)

    await expect(page.getByText('Dueño Borra Reserva')).toBeVisible()
    const fila = page.locator('.col-md-6.col-lg-4', { hasText: 'Dueño Borra Reserva' })
    page.once('dialog', (dialog) => dialog.accept())
    await fila.getByRole('button', { name: 'Eliminar' }).click()

    await expect(page.getByText('Dueño Borra Reserva')).toHaveCount(0)
  })

  test('el backend rechaza con 403 si un usuario intenta borrar la reserva de otro por API', async ({ request }) => {
    const propietario = await registrarUsuarioApi(request, {
      nombre: 'Propietario API', correo: emailUnico('propietario-api'), contrasena: '123456', rol: 'USUARIO',
    })
    const atacante = await registrarUsuarioApi(request, {
      nombre: 'Atacante API', correo: emailUnico('atacante-api'), contrasena: '123456', rol: 'USUARIO',
    })
    usuariosCreados.push(propietario.usuario.id, atacante.usuario.id)

    const reserva = await (await request.post(`${API_URL}/reservas`, {
      data: { espacioId: espacio.id, fecha: '2027-06-03', hora: '09:00' },
      headers: { Authorization: `Bearer ${propietario.token}` },
    })).json()
    reservasCreadas.push(reserva.id)

    const respuesta = await request.delete(`${API_URL}/reservas/${reserva.id}`, {
      headers: { Authorization: `Bearer ${atacante.token}` },
    })
    expect(respuesta.status()).toBe(403)
  })
})
