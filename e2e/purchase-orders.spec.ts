import { expect, test } from '@playwright/test';

test('E2E: create purchase order shows in UI', async ({ page }) => {
  await page.goto('/#/reorder');

  const orderButton = page.getByTestId('po-open').first();
  await orderButton.click();

  await expect(page.getByTestId('po-product')).toBeVisible();
  await page.getByTestId('po-qty').fill('7');
  await page.getByTestId('po-expected-arrival').fill('2031-02-01');
  await page.getByTestId('po-submit').click();

  await page.goto('/#/purchase-orders');
  await expect(page.getByTestId('po-table')).toContainText('ORDERED');
});
