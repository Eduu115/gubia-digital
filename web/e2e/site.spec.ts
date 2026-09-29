import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('la home en español pasa a inglés', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('tallado');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('crafted');
});

test('el comparador responde al teclado', async ({ page }) => {
  await page.goto('/casos/confecciones-ana-mari/');
  const slider = page.getByRole('slider', { name: 'Comparar antes y después' }).first();
  await slider.focus();
  await slider.press('ArrowLeft');
  await expect(slider).toHaveAttribute('aria-valuetext', /Antes 49 %/);
});

test('el aviso de crédito nombra al cliente', async ({ page }) => {
  await page.goto('/casos/confecciones-ana-mari/?ref=footer');
  await expect(page.getByRole('status')).toContainText('Confecciones Ana Mari');
});

test('el formulario sin JS llega a gracias con la API simulada', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.route('**/api/contact', async (route) => {
    await route.fulfill({
      status: 303,
      headers: { location: '/gracias/' },
    });
  });
  await page.goto('/contacto/');
  await page.getByRole('textbox', { name: 'Nombre *' }).fill('Ana');
  await page.getByRole('textbox', { name: 'Email *' }).fill('ana@example.com');
  await page.getByRole('textbox', { name: 'Nombre del negocio *' }).fill('Taller');
  await page.getByRole('textbox', { name: 'Tipo de negocio *' }).fill('Mercería');
  await page.getByRole('checkbox', { name: 'Rediseño' }).check();
  await page.getByRole('checkbox', { name: /política de privacidad/ }).check();
  await page.getByRole('button', { name: 'Enviar' }).click();
  await expect(page).toHaveURL(/\/gracias\/?$/);
  await context.close();
});
