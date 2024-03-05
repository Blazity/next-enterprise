//TODO Install playwright

import { expect, test } from "@playwright/test"

//Form load and initial state validation
test("form loads correctly with initial state", async ({ page }) => {
    await page.goto("/"); //Home URL
  
    // Check if specific fields are present and empty
    await expect(page.locator('input[name="importName"]')).toBeEmpty();
    await expect(page.locator('input[name="manifestFile"]')).toBeEmpty();

    await expect(page.locator('input[name="toleranceWindow"]')).not.toBeChecked();
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
  
    // Optionally, check for the upload progress bar to reach 100%
    await expect(page.locator('.upload-progress')).toHaveCSS('width', '100%');
  });

  //Toggle and submit interactions
  test("toggles a switch and submits the form", async ({ page }) => {
    await page.goto("/");
  
    // Toggle a switch
    await page.locator('input[name="toleranceWindow"]').click();
    await expect(page.locator('input[name="toleranceWindow"]')).toBeChecked();
  
    // Fill in other required fields
    // Select an option from "importName" dropdown
    await page.locator('select[name="importName"]').selectOption({ label: "Import ABC" });

    // Upload a file for "manifestFile"
    await page.locator('input[name="manifestFile"]').setInputFiles('/e2e/testFile.txt');

    // Select an option for "splitSchedule"
    await page.locator('input[name="splitSchedule"][value="Yes"]').click();

    // Select an option for "client"
    await page.locator('input[name="client"][value="Single"]').click();

    // Enable and click the submit button
    const submitButton = page.locator('button', { hasText: 'Continue Import' });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
  
    // Verify submission was successful
    await expect(page.locator('.success-message')).toHaveText(/Success/);
  });

