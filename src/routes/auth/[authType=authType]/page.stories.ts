import type { Meta, StoryObj } from '@storybook/sveltekitkit';
import { expect, within } from '@storybook/test';
import Page from './+page.svelte';

const meta = {
	title: 'Pages/Auth/LoginSignup',
	component: Page,
	parameters: {
		layout: 'fullscreen',
		sveltekit_experimental: {
			stores: {
				page: {
					params: { authType: 'signin' },
					url: new URL('http://localhost:5173/signin'),
					route: { id: '/auth/[authType=authType]' }
				}
			}
		}
	}
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoginPage: Story = {
	parameters: {
		sveltekit_experimental: {
			stores: {
				page: {
					params: { authType: 'signin' }
				}
			}
		}
	}
};

export const SignupPage: Story = {
	parameters: {
		sveltekit_experimental: {
			stores: {
				page: {
					params: { authType: 'signup' }
				}
			}
		}
	}
};

export const SuccessfulLogin: Story = {
	parameters: {
		msw: {
			handlers: [
				http.post('/auth/signin', async ({ request }) => {
					const formData = await request.formData();
					const email = formData.get('email');
					const password = formData.get('password');

					if (email === 'test@example.com' && password === 'password123') {
						return new HttpResponse(null, {
							status: 303,
							headers: { Location: '/' }
						});
					}

					return HttpResponse.json(
						{ success: false, message: 'Invalid credentials' },
						{ status: 400 }
					);
				})
			]
		}
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Fill login form with valid credentials', async () => {
			await userEvent.type(canvas.getByLabelText(/email/i), 'test@example.com');
			await userEvent.type(canvas.getByLabelText(/password/i), 'password123');
		});

		await step('Submit form', async () => {
			await userEvent.click(canvas.getByRole('button', { name: /sign in/i }));
		});

		await step('Verify successful redirect', async () => {
			await waitFor(() => {
				expect(canvas.queryByRole('button', { name: /sign in/i })).not.toBeInTheDocument();
			});
		});
	}
};

export const InvalidCredentials: Story = {
	parameters: {
		msw: {
			handlers: [
				http.post('/auth/signin', () => {
					return HttpResponse.json(
						{ success: false, message: 'Invalid credentials' },
						{ status: 400 }
					);
				})
			]
		}
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Fill login form with invalid credentials', async () => {
			await userEvent.type(canvas.getByLabelText(/email/i), 'invalid@example.com');
			await userEvent.type(canvas.getByLabelText(/password/i), 'wrongpassword');
		});

		await step('Submit form', async () => {
			await userEvent.click(canvas.getByRole('button', { name: /sign in/i }));
		});

		await step('Verify error message appears', async () => {
			await waitFor(() => {
				expect(canvas.getByText(/Invalid credentials/i)).toBeVisible();
			});
		});
	}
};

export const ValidationErrors: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Submit empty form', async () => {
			await userEvent.click(canvas.getByRole('button', { name: /sign in/i }));
		});

		await step('Verify validation errors appear', async () => {
			await waitFor(() => {
				expect(canvas.getByText(/Email is required/i)).toBeVisible();
				expect(canvas.getByText(/Password is required/i)).toBeVisible();
			});
		});

		await step('Fill email and verify error disappears', async () => {
			await userEvent.type(canvas.getByLabelText(/email/i), 'test@example.com');

			await waitFor(() => {
				expect(canvas.queryByText(/Email is required/i)).not.toBeVisible();
				expect(canvas.getByText(/Password is required/i)).toBeVisible();
			});
		});
	}
};

export const SuccessfulSignup: Story = {
	parameters: {
		sveltekit_experimental: {
			stores: {
				page: {
					params: { authType: 'signup' }
				}
			}
		},
		msw: {
			handlers: [
				http.post('/auth/signup', async ({ request }) => {
					const formData = await request.formData();
					const email = formData.get('email');

					if (email === 'newuser@example.com') {
						return new HttpResponse(null, {
							status: 303,
							headers: { Location: '/' }
						});
					}

					return HttpResponse.json(
						{ success: false, message: 'Registration failed' },
						{ status: 400 }
					);
				})
			]
		}
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Fill signup form', async () => {
			await userEvent.type(canvas.getByLabelText(/email/i), 'newuser@example.com');
			await userEvent.type(canvas.getByLabelText(/password/i), 'password123');
			await userEvent.type(canvas.getByLabelText(/confirm.*password/i), 'password123');
		});

		await step('Submit signup form', async () => {
			await userEvent.click(canvas.getByRole('button', { name: /sign up/i }));
		});

		await step('Verify successful registration', async () => {
			await waitFor(() => {
				expect(canvas.queryByRole('button', { name: /sign up/i })).not.toBeVisible();
			});
		});
	}
};

export const DuplicateEmailSignup: Story = {
	parameters: {
		sveltekit_experimental: {
			stores: {
				page: {
					params: { authType: 'signup' }
				}
			}
		},
		msw: {
			handlers: [
				http.post('/auth/signup', () => {
					return HttpResponse.json(
						{ success: false, message: 'Email already exists' },
						{ status: 409 }
					);
				})
			]
		}
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Fill signup form with existing email', async () => {
			await userEvent.type(canvas.getByLabelText(/email/i), 'duplicate@example.com');
			await userEvent.type(canvas.getByLabelText(/password/i), 'password123');
			await userEvent.type(canvas.getByLabelText(/confirm.*password/i), 'password123');
		});

		await step('Submit signup form', async () => {
			await userEvent.click(canvas.getByRole('button', { name: /sign up/i }));
		});

		await step('Verify duplicate email error', async () => {
			await waitFor(() => {
				expect(canvas.getByText(/Email already exists/i)).toBeVisible();
			});
		});
	}
};

export const PasswordMismatch: Story = {
	parameters: {
		sveltekit_experimental: {
			stores: {
				page: {
					params: { authType: 'signup' }
				}
			}
		}
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Fill signup form with mismatched passwords', async () => {
			await userEvent.type(canvas.getByLabelText(/email/i), 'test@example.com');
			await userEvent.type(canvas.getByLabelText(/password/i), 'password123');
			await userEvent.type(canvas.getByLabelText(/confirm.*password/i), 'different456');
		});

		await step('Submit signup form', async () => {
			await userEvent.click(canvas.getByRole('button', { name: /sign up/i }));
		});

		await step('Verify password mismatch error', async () => {
			await waitFor(() => {
				expect(canvas.getByText(/Passwords do not match/i)).toBeVisible();
			});
		});
	}
};
