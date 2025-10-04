import type { Meta, StoryObj } from '@storybook/sveltekit';
import { expect, within } from '@storybook/test';
import SidebarUserNav from './sidebar-user-nav.svelte';
import { mockUser } from '$mocks/data';

const meta = {
	title: 'Components/SidebarUserNav',
	component: SidebarUserNav,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'User navigation sidebar component with profile, settings, and logout functionality.'
			}
		}
	},
	argTypes: {
		user: {
			control: 'object',
			description: 'User object with profile information'
		},
		onLogout: {
			action: 'logout',
			description: 'Callback when user clicks logout'
		}
	}
} satisfies Meta<SidebarUserNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		user: mockUser,
		onLogout: fn()
	}
};

export const LogoutFlow: Story = {
	args: {
		user: mockUser,
		onLogout: fn()
	},
	play: async ({ args, canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Open user menu', async () => {
			const userMenuButton =
				canvas.getByTestId('user-menu') ||
				canvas.getByRole('button', { name: /user menu/i }) ||
				canvas.getByAltText(mockUser.email) ||
				canvas.getByText(mockUser.email.split('@')[0]);

			await userEvent.click(userMenuButton);
		});

		await step('Click logout option', async () => {
			const logoutOption =
				canvas.getByRole('menuitem', { name: /logout/i }) ||
				canvas.getByRole('menuitem', { name: /sign out/i }) ||
				canvas.getByText(/logout/i) ||
				canvas.getByText(/sign out/i);

			await userEvent.click(logoutOption);
		});

		await step('Verify logout callback was called', async () => {
			await waitFor(() => {
				expect(args.onLogout).toHaveBeenCalled();
			});
		});
	}
};

export const ConfirmLogoutDialog: Story = {
	args: {
		user: mockUser,
		onLogout: fn()
	},
	play: async ({ args, canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Open user menu', async () => {
			const userMenuButton =
				canvas.getByTestId('user-menu') ||
				canvas.getByRole('button', { name: /user menu/i }) ||
				canvas.getByAltText(mockUser.email);

			await userEvent.click(userMenuButton);
		});

		await step('Click logout option', async () => {
			const logoutOption =
				canvas.getByRole('menuitem', { name: /logout/i }) || canvas.getByText(/logout/i);

			await userEvent.click(logoutOption);
		});

		await step('Verify confirmation dialog appears', async () => {
			await waitFor(() => {
				expect(
					canvas.getByText(/are you sure/i) ||
						canvas.getByText(/confirm logout/i) ||
						canvas.getByRole('dialog')
				).toBeVisible();
			});
		});

		await step('Confirm logout in dialog', async () => {
			const confirmButton =
				canvas.getByRole('button', { name: /confirm/i }) ||
				canvas.getByRole('button', { name: /yes/i }) ||
				canvas.getByRole('button', { name: /logout/i });

			await userEvent.click(confirmButton);
		});

		await step('Verify logout callback was called', async () => {
			await waitFor(() => {
				expect(args.onLogout).toHaveBeenCalled();
			});
		});
	}
};

export const CancelLogoutDialog: Story = {
	args: {
		user: mockUser,
		onLogout: fn()
	},
	play: async ({ args, canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Open user menu', async () => {
			const userMenuButton =
				canvas.getByTestId('user-menu') || canvas.getByRole('button', { name: /user menu/i });

			await userEvent.click(userMenuButton);
		});

		await step('Click logout option', async () => {
			const logoutOption =
				canvas.getByRole('menuitem', { name: /logout/i }) || canvas.getByText(/logout/i);

			await userEvent.click(logoutOption);
		});

		await step('Verify confirmation dialog appears', async () => {
			await waitFor(() => {
				expect(canvas.getByText(/are you sure/i) || canvas.getByRole('dialog')).toBeVisible();
			});
		});

		await step('Cancel logout in dialog', async () => {
			const cancelButton =
				canvas.getByRole('button', { name: /cancel/i }) ||
				canvas.getByRole('button', { name: /no/i });

			await userEvent.click(cancelButton);
		});

		await step('Verify dialog closes and logout was not called', async () => {
			await waitFor(() => {
				expect(canvas.queryByRole('dialog')).not.toBeVisible();
			});

			expect(args.onLogout).not.toHaveBeenCalled();
		});
	}
};

export const WithSettingsLink: Story = {
	args: {
		user: mockUser,
		onLogout: fn()
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Open user menu', async () => {
			const userMenuButton =
				canvas.getByTestId('user-menu') || canvas.getByRole('button', { name: /user menu/i });

			await userEvent.click(userMenuButton);
		});

		await step('Click settings option', async () => {
			const settingsOption =
				canvas.getByRole('menuitem', { name: /settings/i }) || canvas.getByText(/settings/i);

			await userEvent.click(settingsOption);
		});

		await step('Verify navigation to settings', async () => {
			await waitFor(() => {
				expect(canvas.queryByRole('menu')).not.toBeVisible();
			});
		});
	}
};

export const DarkModeToggle: Story = {
	args: {
		user: mockUser,
		onLogout: fn()
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Open user menu', async () => {
			const userMenuButton =
				canvas.getByTestId('user-menu') || canvas.getByRole('button', { name: /user menu/i });

			await userEvent.click(userMenuButton);
		});

		await step('Click theme toggle option', async () => {
			const themeToggle =
				canvas.getByText(/toggle.*mode/i) ||
				canvas.getByRole('menuitem', { name: /toggle.*mode/i });

			await userEvent.click(themeToggle);
		});

		await step('Verify theme changes', async () => {
			await waitFor(() => {
				const body = document.body;
				const html = document.documentElement;
				expect(
					body.classList.contains('dark') ||
						html.classList.contains('dark') ||
						body.getAttribute('data-theme') === 'dark'
				).toBeTruthy();
			});
		});

		await step('Toggle back to light mode', async () => {
			const themeToggle = canvas.getByText(/toggle.*mode/i);

			await userEvent.click(themeToggle);
		});

		await step('Verify theme changes back', async () => {
			await waitFor(() => {
				const body = document.body;
				const html = document.documentElement;
				expect(
					!body.classList.contains('dark') &&
						!html.classList.contains('dark') &&
						body.getAttribute('data-theme') !== 'dark'
				).toBeTruthy();
			});
		});
	}
};

export const AnonymousUser: Story = {
	args: {
		user: null,
		onLogout: fn()
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify login prompt is shown', async () => {
			await waitFor(() => {
				expect(
					canvas.getByText(/sign in/i) ||
						canvas.getByText(/login/i) ||
						canvas.getByRole('button', { name: /sign in/i })
				).toBeVisible();
			});
		});
	}
};
