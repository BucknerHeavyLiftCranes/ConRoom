import { test, expect } from '@playwright/test'

test('Room Status page loads correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/room') // Adjust port if needed
  await expect(page.locator('text=Room Status')).toBeVisible()
})
