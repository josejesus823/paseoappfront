import { test, expect } from '@playwright/test'
import { emailUnico, eliminarConToken, registrarUsuarioApi } from './utils/api'

test.describe('Registro e inicio de sesion', () => {
  let adminToken
  let adminId
  const usuariosCreados = []

  test.beforeAll(async ({ request }) => {
    const admin = await registrarUsuarioApi(request, {
      nombre: 'Admin Limpieza QA', correo: emailUnico('admin-registro'), contrasena: '123456', rol: 'ADMINISTRADOR',
    })
    adminToken = admin.token
    adminId = admin.usuario.id
  })

  test.afterAll(async ({ request }) => {
    for (const id of usuariosCreados) {
      await eliminarConToken(request, `/usuarios/${id}`, adminToken)
    }
    await eliminarConToken(request, `/usuarios/${adminId}`, adminToken)
  })

  test('un visitante puede registrarse y queda autenticado en Home', async ({ page }) => {
    const correo = emailUnico('registro')
    await page.goto('/registro')
    await page.locator('input[name="nombre"]').fill('Usuario Prueba')
    await page.locator('input[name="correo"]').fill(correo)
    await page.locator('input[name="contrasena"]').fill('123456')
    await page.locator('select[name="rol"]').selectOption('USUARIO')
    await page.getByRole('button', { name: 'Registrarse' }).click()

    await expect(page).toHaveURL(/\/home$/)
    await expect(page.getByText('Usuario Prueba')).toBeVisible()

    const sesion = await page.evaluate(() => JSON.parse(localStorage.getItem('paseoapp_sesion')))
    usuariosCreados.push(sesion.id)
  })

  test('login con credenciales invalidas muestra un error', async ({ page }) => {
    await page.goto('/')
    await page.locator('input[name="correo"]').fill('no-existe@playwright.test')
    await page.locator('input[name="contrasena"]').fill('loquesea')
    await page.getByRole('button', { name: 'Ingresar' }).click()

    await expect(page.locator('.alert-danger')).toBeVisible()
    await expect(page.locator('.alert-danger')).toContainText('Credenciales invalidas')
  })

  test('un usuario registrado puede cerrar sesion y volver a iniciarla', async ({ page }) => {
    const correo = emailUnico('logout')
    await page.goto('/registro')
    await page.locator('input[name="nombre"]').fill('Usuario Logout')
    await page.locator('input[name="correo"]').fill(correo)
    await page.locator('input[name="contrasena"]').fill('123456')
    await page.locator('select[name="rol"]').selectOption('USUARIO')
    await page.getByRole('button', { name: 'Registrarse' }).click()
    await expect(page).toHaveURL(/\/home$/)

    const sesion = await page.evaluate(() => JSON.parse(localStorage.getItem('paseoapp_sesion')))
    usuariosCreados.push(sesion.id)

    await page.getByRole('button', { name: 'Salir' }).click()
    await expect(page).toHaveURL('/')

    await page.locator('input[name="correo"]').fill(correo)
    await page.locator('input[name="contrasena"]').fill('123456')
    await page.getByRole('button', { name: 'Ingresar' }).click()
    await expect(page).toHaveURL(/\/home$/)
  })
})
