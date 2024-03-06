//TODO Install playwright

import { expect, test } from "@playwright/test"

//Form load and initial state validation
test("form loads correctly with initial state", async ({ page }) => {
    await page.goto("/"); //Home URL
  
    // Check if specific fields are present and the default selected option is the placeholder value
    await expect(page.locator('select[name="importName"] option').first()).toHaveText('Select Import Name:');
    
    // Check if the file upload field indicates that no file is selected
    await expect(page.locator('.file-info')).not.toBeVisible();

    // Verify that no option is selected initially for "splitSchedule"
    await expect(page.locator('input[name="splitSchedule"]:checked')).toHaveCount(0);

    // Verify that no option is selected initially for "client"
    await expect(page.locator('input[name="client"]:checked')).toHaveCount(0);
  
    // Check for the presence of the submit button and that it's initially disabled
    const submitButton = page.locator('button', { hasText: 'Continue Import' });
    await expect(submitButton).toBeDisabled();
  });

  //File upload validation
  test("handles file upload correctly", async ({ page }) => {
    await page.goto("/");
  
    // Simulate file upload
    await page.setInputFiles('input[type="file"]', '/e2e/testFile.txt');
  
    // Check if the file name is displayed correctly
    await expect(page.locator('.file-info')).toHaveText(/testFile.txt/);
  });

  //Toggle and submit interactions
  test("toggles a switch and submits the form", async ({ page }) => {
    await page.goto("/");
  
    // Toggle a switch
    await page.locator('.toggle-switch').click();
    // Wait for the 'aria-checked' attribute to become 'true'
    await expect(page.locator('.toggle-switch')).toHaveAttribute('aria-checked', 'true', { timeout: 5000 });
  
    // Fill in other required fields
    // Select an option from "importName" dropdown
    await page.locator('select[name="importName"]').selectOption({ label: "Import ABC" });

    // Upload a file for "manifestFile"
    await page.locator('input[type="file"]').setInputFiles('/e2e/testFile.txt');

    // Select an option for "splitSchedule"
    await page.locator('button[role="radio"][value="Yes"]').click();

    // Select an option for "client"
    await page.locator('button[role="radio"][value="Single"]').click();

    // Enable and click the submit button
    const submitButton = page.locator('button', { hasText: 'Continue Import' });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
  
    // Verify submission was successful
    await expect(page.locator('.success-message')).toHaveText(/Success/);
  });

