import { test, expect } from '@playwright/test'
import {
  emailUnico,
  registrarUsuarioApi,
  crearEspacioApi,
  eliminarConToken,
  inyectarSesion,
  listarReservasApi,
} from './utils/api'

test.describe('Reglas de negocio de reservas', () => {
  let adminToken
  let adminId
  let espacio
  const usuariosCreados = []
  const reservasCreadas = []

  test.beforeAll(async ({ request }) => {
    const admin = await registrarUsuarioApi(request, {
      nombre: 'Admin Reservas QA', correo: emailUnico('admin-reservas'), contrasena: '123456', rol: 'ADMINISTRADOR',
    })
    adminToken = admin.token
    adminId = admin.usuario.id
    espacio = await crearEspacioApi(request, {
      nombre: `Espacio Reservas QA ${Date.now()}`,
      descripcion: 'Espacio generado para pruebas automatizadas de reservas',
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

  test('un visitante sin sesion es redirigido a login al intentar reservar', async ({ page }) => {
    await page.goto('/registrar-reserva')
    await expect(page).toHaveURL('/')
  })

  test('una reserva fuera del horario 9am-10pm muestra un error de validacion', async ({ page, request }) => {
    const usuario = await registrarUsuarioApi(request, {
      nombre: 'Usuario Horario', correo: emailUnico('horario'), contrasena: '123456', rol: 'USUARIO',
    })
    usuariosCreados.push(usuario.usuario.id)
    await inyectarSesion(page, usuario)

    await page.goto('/registrar-reserva')
    await page.locator('select[name="espacioId"]').selectOption(espacio.id)
    await page.locator('input[name="fecha"]').fill('2027-01-10')
    await page.locator('input[name="hora"]').fill('06:00')
    await page.getByRole('button', { name: 'Confirmar reserva' }).click()

    await expect(page.getByText(/Las reservas solo son validas/)).toBeVisible()
    await expect(page).toHaveURL(/\/registrar-reserva$/)
  })

  test('un usuario puede crear una reserva valida y no puede crear una segunda', async ({ page, request }) => {
    const usuario = await registrarUsuarioApi(request, {
      nombre: 'Usuario Unica Reserva', correo: emailUnico('unica'), contrasena: '123456', rol: 'USUARIO',
    })
    usuariosCreados.push(usuario.usuario.id)
    await inyectarSesion(page, usuario)

    await page.goto('/registrar-reserva')
    await page.locator('select[name="espacioId"]').selectOption(espacio.id)
    await page.locator('input[name="fecha"]').fill('2027-01-11')
    await page.locator('input[name="hora"]').fill('10:00')
    await page.getByRole('button', { name: 'Confirmar reserva' }).click()

    await expect(page).toHaveURL(/\/reservas$/)

    const lista = await listarReservasApi(request, adminToken)
    const creada = lista.find((r) => r.usuario.id === usuario.usuario.id)
    expect(creada).toBeTruthy()
    reservasCreadas.push(creada.id)

    await page.goto('/registrar-reserva')
    await page.locator('select[name="espacioId"]').selectOption(espacio.id)
    await page.locator('input[name="fecha"]').fill('2027-02-01')
    await page.locator('input[name="hora"]').fill('11:00')
    await page.getByRole('button', { name: 'Confirmar reserva' }).click()

    await expect(page.locator('.alert-danger')).toContainText('ya tiene una reserva activa')
  })

  test('dos usuarios no pueden reservar el mismo espacio el mismo dia con menos de 5 horas de diferencia', async ({ page, request }) => {
    const usuario1 = await registrarUsuarioApi(request, {
      nombre: 'Usuario Gap Uno', correo: emailUnico('gap1'), contrasena: '123456', rol: 'USUARIO',
    })
    const usuario2 = await registrarUsuarioApi(request, {
      nombre: 'Usuario Gap Dos', correo: emailUnico('gap2'), contrasena: '123456', rol: 'USUARIO',
    })
    usuariosCreados.push(usuario1.usuario.id, usuario2.usuario.id)

    await inyectarSesion(page, usuario1)
    await page.goto('/registrar-reserva')
    await page.locator('select[name="espacioId"]').selectOption(espacio.id)
    await page.locator('input[name="fecha"]').fill('2027-03-01')
    await page.locator('input[name="hora"]').fill('09:00')
    await page.getByRole('button', { name: 'Confirmar reserva' }).click()
    await expect(page).toHaveURL(/\/reservas$/)

    const lista = await listarReservasApi(request, adminToken)
    const creada = lista.find((r) => r.usuario.id === usuario1.usuario.id && r.fecha === '2027-03-01')
    expect(creada).toBeTruthy()
    reservasCreadas.push(creada.id)

    await inyectarSesion(page, usuario2)
    await page.goto('/registrar-reserva')
    await page.locator('select[name="espacioId"]').selectOption(espacio.id)
    await page.locator('input[name="fecha"]').fill('2027-03-01')
    await page.locator('input[name="hora"]').fill('12:00')
    await page.getByRole('button', { name: 'Confirmar reserva' }).click()

    await expect(page.locator('.alert-danger')).toContainText('5 horas')
  })

  test('con exactamente 5 horas de diferencia si se permite la reserva', async ({ page, request }) => {
    const usuario1 = await registrarUsuarioApi(request, {
      nombre: 'Usuario Limite Uno', correo: emailUnico('limite1'), contrasena: '123456', rol: 'USUARIO',
    })
    const usuario2 = await registrarUsuarioApi(request, {
      nombre: 'Usuario Limite Dos', correo: emailUnico('limite2'), contrasena: '123456', rol: 'USUARIO',
    })
    usuariosCreados.push(usuario1.usuario.id, usuario2.usuario.id)

    await inyectarSesion(page, usuario1)
    await page.goto('/registrar-reserva')
    await page.locator('select[name="espacioId"]').selectOption(espacio.id)
    await page.locator('input[name="fecha"]').fill('2027-04-01')
    await page.locator('input[name="hora"]').fill('09:00')
    await page.getByRole('button', { name: 'Confirmar reserva' }).click()
    await expect(page).toHaveURL(/\/reservas$/)

    await inyectarSesion(page, usuario2)
    await page.goto('/registrar-reserva')
    await page.locator('select[name="espacioId"]').selectOption(espacio.id)
    await page.locator('input[name="fecha"]').fill('2027-04-01')
    await page.locator('input[name="hora"]').fill('14:00')
    await page.getByRole('button', { name: 'Confirmar reserva' }).click()
    await expect(page).toHaveURL(/\/reservas$/)

    const lista = await listarReservasApi(request, adminToken)
    for (const usuario of [usuario1, usuario2]) {
      const creada = lista.find((r) => r.usuario.id === usuario.usuario.id && r.fecha === '2027-04-01')
      expect(creada).toBeTruthy()
      reservasCreadas.push(creada.id)
    }
  })
})
