import { test, expect } from '@playwright/test'
import { emailUnico, registrarUsuarioApi, eliminarConToken, listarEspaciosApi } from './utils/api'

test.describe('Gestion de espacios', () => {
  let adminToken
  let adminId
  const espaciosCreados = []

  test.beforeAll(async ({ request }) => {
    const admin = await registrarUsuarioApi(request, {
      nombre: 'Admin Espacios QA', correo: emailUnico('admin-espacios'), contrasena: '123456', rol: 'ADMINISTRADOR',
    })
    adminToken = admin.token
    adminId = admin.usuario.id
  })

  test.afterAll(async ({ request }) => {
    for (const id of espaciosCreados) {
      await eliminarConToken(request, `/espacios/${id}`, adminToken)
    }
    await eliminarConToken(request, `/usuarios/${adminId}`, adminToken)
  })

  test('se puede registrar un nuevo espacio y aparece en la lista', async ({ page, request }) => {
    const nombre = `Espacio QA ${Date.now()}`
    await page.goto('/registrar-espacio')
    await page.locator('input[name="nombre"]').fill(nombre)
    await page.locator('textarea[name="descripcion"]').fill('Descripcion de prueba generada por Playwright')
    await page.locator('input[name="foto"]').fill('https://example.com/foto.jpg')
    await page.locator('input[name="aforo"]').fill('15')
    await page.getByRole('button', { name: 'Guardar espacio' }).click()

    await expect(page).toHaveURL(/\/espacios$/)
    await expect(page.getByText(nombre)).toBeVisible()

    const lista = await listarEspaciosApi(request)
    const creado = lista.find((e) => e.nombre === nombre)
    expect(creado).toBeTruthy()
    espaciosCreados.push(creado.id)
  })

  test('el formulario valida los campos obligatorios', async ({ page }) => {
    await page.goto('/registrar-espacio')
    await page.getByRole('button', { name: 'Guardar espacio' }).click()

    await expect(page.locator('.invalid-feedback').first()).toBeVisible()
    await expect(page).toHaveURL(/\/registrar-espacio$/)
  })
})
