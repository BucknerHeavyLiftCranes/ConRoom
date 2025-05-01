import { test, expect } from '@playwright/test'

test('full reservation create and delete flow', async ({ page }) => {
  await page.goto('/')

  // Step 1: Open New Event Form
  await page.click('text=Create Reservation')

  // Step 2: Fill in organizer name
  await page.fill('input[placeholder="Organizer Name"]', 'Alice')

  // Step 3: Fill in primary attendee email
  await page.fill('input[placeholder="Your Email"]', 'alice@example.com')

  // Step 4: Add another attendee
  await page.click('button:has-text("+")')
  await page.fill('input[placeholder="Attendee 1 Email"]', 'bob@example.com')

  // Step 5: Confirm reservation
  await page.click('button:has-text("Confirm")')

  // Step 6: Verify it appears
  await expect(page.locator('h3')).toContainText('Alice')

  // Step 7: Click Delete
  await page.click('button:has-text("Delete")')

  // Step 8: Confirm popup appears
  await expect(page.locator('text=Reservation Deleted')).toBeVisible()
  await expect(page.locator('text=Title: Alice')).toBeVisible()

  // Step 9: Close popup (triggers onDelete)
  await page.click('button:has-text("×")')

  // Step 10: Ensure reservation is removed
  await expect(page.locator('text=Alice')).not.toBeVisible()
})
