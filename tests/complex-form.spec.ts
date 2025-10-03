import { test, expect } from '@playwright/test';
import { createTestDb, clearTables } from '../tests/test-db/setup';
import { user, userProfile } from '../src/lib/server/db/schema';
import { createUserProfile, getUserProfile, updateUserProfile } from '../src/lib/server/db/queries';

test.describe('Complex User Profile Form Integration', () => {
	let testDb: any;
	let testUserId: string;

	test.beforeAll(async () => {
		testDb = await createTestDb();
		await clearTables();
	});

	test.afterAll(async () => {
		await clearTables();
	});

	test.beforeEach(async () => {
		await clearTables();

		// Create test user
		const [userResult] = await testDb.insert(user).values({
			id: 'test-user-123',
			email: 'test@example.com',
			username: 'testuser',
			passwordHash: 'hashedpassword'
		}).returning();

		testUserId = userResult.id;
	});

	test('should load empty form for new user', async ({ page }) => {
		await page.goto('/profile');

		// Verify form loads
		await expect(page.locator('h1')).toContainText('User Profile Management');
		await expect(page.locator('input[name="profile.firstName"]')).toBeVisible();
		await expect(page.locator('input[name="profile.lastName"]')).toBeVisible();

		// Verify form is empty
		await expect(page.locator('input[name="profile.firstName"]')).toHaveValue('');
		await expect(page.locator('input[name="profile.lastName"]')).toHaveValue('');
	});

	test('should load existing profile data', async ({ page }) => {
		// Create user profile in database
		await createUserProfile({
			userId: testUserId,
			firstName: 'John',
			lastName: 'Doe',
			dateOfBirth: '1990-01-01',
			phoneNumber: '+1234567890',
			address: {
				street: '123 Main St',
				city: 'Anytown',
				state: 'CA',
				zipCode: '12345',
				country: 'USA'
			},
			experienceLevel: 'mid',
			industry: 'Technology',
			company: 'Tech Corp',
			jobTitle: 'Software Developer',
			yearsOfExperience: 5,
			linkedinUrl: 'https://linkedin.com/in/johndoe',
			githubUrl: 'https://github.com/johndoe',
			portfolioUrl: 'https://johndoe.dev',
			bio: 'Passionate software developer',
			skills: ['JavaScript', 'TypeScript', 'React'],
			education: [{
				institution: 'University of Example',
				degree: 'Bachelor of Science',
				fieldOfStudy: 'Computer Science',
				startDate: '2008-09-01',
				endDate: '2012-05-01',
				isCurrentlyEnrolled: false
			}],
			certifications: [{
				name: 'AWS Certified Developer',
				issuer: 'Amazon Web Services',
				issueDate: '2020-01-01',
				expirationDate: '2023-01-01',
				credentialId: 'ABC123'
			}],
			languages: [{
				language: 'English',
				proficiency: 'native'
			}],
			timezone: 'America/Los_Angeles',
			availability: 'available'
		});

		await page.goto('/profile');

		// Verify profile data loads
		await expect(page.locator('input[name="profile.firstName"]')).toHaveValue('John');
		await expect(page.locator('input[name="profile.lastName"]')).toHaveValue('Doe');
		await expect(page.locator('select[name="profile.experienceLevel"]')).toHaveValue('mid');
		await expect(page.locator('input[name="profile.linkedinUrl"]')).toHaveValue('https://linkedin.com/in/johndoe');
	});

	test('should validate required fields', async ({ page }) => {
		await page.goto('/profile');

		// Try to submit empty form
		await page.locator('button[type="submit"]').click();

		// Verify validation errors appear
		await expect(page.locator('span.error-message')).toContainText('First name is required');
		await expect(page.locator('span.error-message')).toContainText('Last name is required');
	});

	test('should validate field formats', async ({ page }) => {
		await page.goto('/profile');

		// Fill invalid data
		await page.locator('input[name="profile.firstName"]').fill('A'); // Too short
		await page.locator('input[name="profile.linkedinUrl"]').fill('invalid-url'); // Invalid URL

		await page.locator('button[type="submit"]').click();

		// Verify format validation errors
		await expect(page.locator('span.error-message')).toContainText('First name must be at least 2 characters');
		await expect(page.locator('span.error-message')).toContainText('Please enter a valid LinkedIn URL');
	});

	test('should fetch and display external data', async ({ page }) => {
		// Create user profile first
		await createUserProfile({
			userId: testUserId,
			firstName: 'John',
			lastName: 'Doe',
			experienceLevel: 'mid'
		});

		await page.goto('/profile');

		// Wait for external data to load (simulated API call)
		await page.waitForSelector('.external-data-grid', { timeout: 5000 });

		// Verify external data displays
		await expect(page.locator('text=Credit Score')).toBeVisible();
		await expect(page.locator('text=Employment Status')).toBeVisible();
		await expect(page.locator('text=Income Range')).toBeVisible();
		await expect(page.locator('text=Risk Profile')).toBeVisible();
	});

	test('should save profile successfully', async ({ page }) => {
		await page.goto('/profile');

		// Fill form with valid data
		await page.locator('input[name="profile.firstName"]').fill('Jane');
		await page.locator('input[name="profile.lastName"]').fill('Smith');
		await page.locator('select[name="profile.experienceLevel"]').selectOption('senior');
		await page.locator('input[name="profile.industry"]').fill('Finance');
		await page.locator('input[name="profile.company"]').fill('Big Bank Inc');
		await page.locator('input[name="profile.jobTitle"]').fill('Senior Developer');

		// Submit form
		await page.locator('button[type="submit"]').click();

		// Verify success (in real app, would redirect or show success message)
		await expect(page.locator('text=Profile updated successfully')).toBeVisible();
	});

	test('should handle external API errors gracefully', async ({ page }) => {
		// Mock external API to fail
		await page.route('**/external-api/**', route => {
			route.abort();
		});

		await page.goto('/profile');

		// Verify form still loads despite external API failure
		await expect(page.locator('h1')).toContainText('User Profile Management');
		await expect(page.locator('input[name="profile.firstName"]')).toBeVisible();
	});

	test('should test form accessibility', async ({ page }) => {
		await page.goto('/profile');

		// Test keyboard navigation
		await page.keyboard.press('Tab');
		await expect(page.locator('input[name="profile.firstName"]')).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(page.locator('input[name="profile.lastName"]')).toBeFocused();

		// Test form submission with keyboard
		await page.locator('input[name="profile.firstName"]').fill('John');
		await page.locator('input[name="profile.lastName"]').fill('Doe');

		// Navigate to submit button and press Enter
		await page.keyboard.press('Tab'); // Navigate through form fields
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');

		// Should trigger validation
		await expect(page.locator('span.error-message')).toBeVisible();
	});

	test('should test responsive design', async ({ page }) => {
		await page.goto('/profile');

		// Test mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('input[name="profile.firstName"]')).toBeVisible();

		// Test tablet viewport
		await page.setViewportSize({ width: 768, height: 1024 });

		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('.form-grid')).toBeVisible();
	});

	test('should handle concurrent form interactions', async ({ page }) => {
		await page.goto('/profile');

		// Fill multiple fields quickly
		await page.locator('input[name="profile.firstName"]').fill('John');
		await page.locator('input[name="profile.lastName"]').fill('Doe');
		await page.locator('input[name="profile.phoneNumber"]').fill('+1234567890');

		// Verify all fields maintain their values
		await expect(page.locator('input[name="profile.firstName"]')).toHaveValue('John');
		await expect(page.locator('input[name="profile.lastName"]')).toHaveValue('Doe');
		await expect(page.locator('input[name="profile.phoneNumber"]')).toHaveValue('+1234567890');
	});

	test('should test form with complex nested data', async ({ page }) => {
		await page.goto('/profile');

		// Fill address information
		await page.locator('input[name="profile.address.street"]').fill('123 Main St');
		await page.locator('input[name="profile.address.city"]').fill('Anytown');
		await page.locator('input[name="profile.address.state"]').fill('CA');
		await page.locator('input[name="profile.address.zipCode"]').fill('12345');

		// Add skills
		await page.locator('input[name="profile.skills"]').first().fill('JavaScript');
		await page.locator('button:has-text("Add Skill")').click();

		// Verify complex data is preserved
		await expect(page.locator('input[name="profile.address.street"]')).toHaveValue('123 Main St');
		await expect(page.locator('input[name="profile.skills"]')).toHaveCount(1);
	});
});

test.describe('Storybook Integration Tests', () => {
	test('should test storybook stories in browser', async ({ page }) => {
		// Test Storybook interface
		await page.goto('http://localhost:6006');

		// Navigate to our complex form stories
		await page.locator('[data-testid="storybook-explorer-tree"] button:has-text("ComplexUserProfileForm")').click();

		// Test story navigation
		await expect(page.locator('[data-testid="storybook-panel-root"]')).toBeVisible();

		// Test different story variants
		await page.goto('http://localhost:6006/?path=/story/components-complexuserprofileform--with-profile-data');

		const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]');
		await expect(storyFrame.locator('input[name="profile.firstName"]')).toHaveValue('John');
	});

	test('should test story interactions', async ({ page }) => {
		await page.goto('http://localhost:6006/?path=/story/components-complexuserprofileform--empty-form');

		const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]');

		// Test form interactions in story
		await storyFrame.locator('input[name="profile.firstName"]').fill('Test');
		await storyFrame.locator('input[name="profile.lastName"]').fill('User');

		await expect(storyFrame.locator('input[name="profile.firstName"]')).toHaveValue('Test');
		await expect(storyFrame.locator('input[name="profile.lastName"]')).toHaveValue('User');
	});

	test('should test story with validation errors', async ({ page }) => {
		await page.goto('http://localhost:6006/?path=/story/components-complexuserprofileform--with-validation-errors');

		const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]');

		// Verify validation errors are displayed
		await expect(storyFrame.locator('span.error-message')).toContainText('First name must be at least 2 characters');
		await expect(storyFrame.locator('span.error-message')).toContainText('Last name is required');
	});
});

test.describe('Component Testing with Stories', () => {
	test('should test component stories with Playwright CT', async ({ mount }) => {
		// Import story data
		const { WithProfileData } = await import('$lib/components/ComplexUserProfileForm.stories.ts');

		const component = await mount(<WithProfileData />);

		// Test component renders with story data
		await expect(component.locator('input[name="profile.firstName"]')).toHaveValue('John');
		await expect(component.locator('input[name="profile.lastName"]')).toHaveValue('Doe');

		// Test external data display
		await expect(component.locator('text=Credit Score')).toBeVisible();
		await expect(component.locator('text=720')).toBeVisible();
	});

	test('should test form validation in component', async ({ mount }) => {
		const { WithValidationErrors } = await import('$lib/components/ComplexUserProfileForm.stories.ts');

		const component = await mount(<WithValidationErrors />);

		// Verify validation errors are displayed
		await expect(component.locator('span.error-message')).toContainText('First name must be at least 2 characters');
	});

	test('should test external data loading', async ({ mount }) => {
		const { ExternalDataLoading } = await import('$lib/components/ComplexUserProfileForm.stories.ts');

		const component = await mount(<ExternalDataLoading />);

		// Verify loading state
		await expect(component.locator('text=Loading external data...')).toBeVisible();

		// Wait for data to load (in real test, might need to mock API)
		// await expect(component.locator('text=Credit Score')).toBeVisible();
	});
});

test.describe('End-to-End User Journey', () => {
	test('should complete full user profile creation journey', async ({ page }) => {
		await page.goto('/profile');

		// Step 1: Fill basic information
		await page.locator('input[name="profile.firstName"]').fill('Alice');
		await page.locator('input[name="profile.lastName"]').fill('Johnson');
		await page.locator('input[name="profile.dateOfBirth"]').fill('1985-06-15');
		await page.locator('input[name="profile.phoneNumber"]').fill('+1555123456');

		// Step 2: Fill address
		await page.locator('input[name="profile.address.street"]').fill('456 Oak Ave');
		await page.locator('input[name="profile.address.city"]').fill('Springfield');
		await page.locator('input[name="profile.address.state"]').fill('IL');
		await page.locator('input[name="profile.address.zipCode"]').fill('62701');

		// Step 3: Fill professional information
		await page.locator('select[name="profile.experienceLevel"]').selectOption('senior');
		await page.locator('input[name="profile.industry"]').fill('Healthcare');
		await page.locator('input[name="profile.company"]').fill('MedTech Solutions');
		await page.locator('input[name="profile.jobTitle"]').fill('Senior Software Engineer');
		await page.locator('input[name="profile.yearsOfExperience"]').fill('8');

		// Step 4: Fill online presence
		await page.locator('input[name="profile.linkedinUrl"]').fill('https://linkedin.com/in/alicejohnson');
		await page.locator('input[name="profile.githubUrl"]').fill('https://github.com/alicejohnson');
		await page.locator('input[name="profile.portfolioUrl"]').fill('https://alicejohnson.dev');

		// Step 5: Add skills
		await page.locator('input[name="profile.skills"]').first().fill('Python');
		await page.locator('button:has-text("Add Skill")').click();

		// Step 6: Wait for external data to load
		await page.waitForSelector('.external-data-grid', { timeout: 5000 });

		// Step 7: Submit form
		await page.locator('button[type="submit"]').click();

		// Step 8: Verify success
		await expect(page.locator('text=Profile updated successfully')).toBeVisible();

		// Step 9: Verify data persistence (reload page)
		await page.reload();

		// Verify data is still there
		await expect(page.locator('input[name="profile.firstName"]')).toHaveValue('Alice');
		await expect(page.locator('input[name="profile.lastName"]')).toHaveValue('Johnson');
	});

	test('should handle external API failures gracefully', async ({ page }) => {
		// Mock external API to fail
		await page.route('**/external-api/**', route => {
			route.abort('failed');
		});

		await page.goto('/profile');

		// Verify form still loads despite API failure
		await expect(page.locator('h1')).toContainText('User Profile Management');

		// Fill form and submit
		await page.locator('input[name="profile.firstName"]').fill('Bob');
		await page.locator('input[name="profile.lastName"]').fill('Wilson');
		await page.locator('button[type="submit"]').click();

		// Should still work without external data
		await expect(page.locator('text=Profile updated successfully')).toBeVisible();
	});
});
