import { test, expect } from '@playwright/test';

test('should navigate to the home page and check the title', async ({ page }) => {
  // Navigate to the home page
  await page.goto('http://localhost:4200/');

  // Assert that the page title is "MyReactApp"
  await expect(page).toHaveTitle('MyReactApp');
});
