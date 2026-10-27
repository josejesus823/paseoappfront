import { test, expect } from '@playwright/test'
import { emailUnico, registrarUsuarioApi, eliminarConToken, inyectarSesion, API_URL } from './utils/api'

test.describe('Permisos de administrador', () => {
  let adminToken
  let adminId
  const usuariosCreados = []

  test.beforeAll(async ({ request }) => {
    const admin = await registrarUsuarioApi(request, {
      nombre: 'Admin Permisos QA', correo: emailUnico('admin-permisos'), contrasena: '123456', rol: 'ADMINISTRADOR',
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

  test('un usuario normal no ve el boton de eliminar en la lista de usuarios', async ({ page, request }) => {
    const usuario = await registrarUsuarioApi(request, {
      nombre: 'Usuario Sin Permiso', correo: emailUnico('sinpermiso'), contrasena: '123456', rol: 'USUARIO',
    })
    usuariosCreados.push(usuario.usuario.id)
    await inyectarSesion(page, usuario)

    await page.goto('/usuarios')
    await expect(page.getByText('Usuario Sin Permiso')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Eliminar' })).toHaveCount(0)
  })

  test('un administrador ve el boton de eliminar y puede borrar un usuario', async ({ page, request }) => {
    const admin = { token: adminToken, usuario: { id: adminId, nombre: 'Admin Permisos QA', rol: 'ADMINISTRADOR' } }
    await inyectarSesion(page, admin)

    const nombreBorrable = `Usuario Borrable ${Date.now()}`
    const res = await request.post(`${API_URL}/usuarios`, {
      data: { nombre: nombreBorrable, correo: emailUnico('borrable'), contrasena: '123456', rol: 'USUARIO' },
    })
    const creado = await res.json()
    usuariosCreados.push(creado.usuario.id)

    await page.goto('/usuarios')
    await expect(page.getByText(nombreBorrable)).toBeVisible()

    const fila = page.locator('.col-md-6.col-lg-4', { hasText: nombreBorrable })
    page.once('dialog', (dialog) => dialog.accept())
    await fila.getByRole('button', { name: 'Eliminar' }).click()

    await expect(page.getByText(nombreBorrable)).toHaveCount(0)
  })

  test('un administrador ve el boton de eliminar en reservas', async ({ page }) => {
    const admin = { token: adminToken, usuario: { id: adminId, nombre: 'Admin Permisos QA', rol: 'ADMINISTRADOR' } }
    await inyectarSesion(page, admin)

    await page.goto('/reservas')
    const botonesEliminar = page.getByRole('button', { name: 'Eliminar' })
    const total = await page.locator('.col-md-6.col-lg-4').count()
    if (total > 0) {
      await expect(botonesEliminar.first()).toBeVisible()
    }
  })
})
