import type { Meta, StoryObj } from '@storybook/sveltekitkit';
import { expect, within } from '@storybook/test';
import Page from './+page.svelte';
import { mockUser, mockChats } from '$mocks/data';

const meta = {
	title: 'Pages/Chat/NewChat',
	component: Page,
	parameters: {
		layout: 'fullscreen',
		sveltekit_experimental: {
			stores: {
				page: {
					data: {
						user: mockUser,
						chats: mockChats
					},
					params: {},
					url: new URL('http://localhost:5173/chat'),
					route: { id: '/chat' }
				}
			}
		}
	}
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyChat: Story = {
	parameters: {
		msw: {
			handlers: [
				http.get('/api/history', () => {
					return HttpResponse.json([]);
				}),
				http.post('/api/chat', async ({ request }) => {
					const { messages: _messages } = await request.json();
					await new Promise((resolve) => setTimeout(resolve, 500));

					return HttpResponse.json({
						id: 'msg-new',
						role: 'assistant',
						content: 'Hello! How can I help you today?',
						parts: [{ type: 'text', text: 'Hello! How can I help you today?' }]
					});
				})
			]
		}
	}
};

export const WithChatHistory: Story = {
	parameters: {
		msw: {
			handlers: [
				http.get('/api/history', () => {
					return HttpResponse.json(mockChats);
				})
			]
		}
	}
};

export const SendFirstMessage: Story = {
	parameters: {
		msw: {
			handlers: [
				http.post('/api/chat', async ({ request }) => {
					const { messages: _messages } = await request.json();
					await new Promise((resolve) => setTimeout(resolve, 300));

					return HttpResponse.json({
						id: 'msg-1',
						role: 'assistant',
						content: "That's a great question! Let me explain...",
						parts: [{ type: 'text', text: "That's a great question! Let me explain..." }]
					});
				})
			]
		}
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Type a message', async () => {
			const input =
				canvas.getByPlaceholderText(/ask anything/i) ||
				canvas.getByRole('textbox', { name: /message/i }) ||
				canvas.getByTestId('message-input');

			await userEvent.type(input, 'What is SvelteKit?');
		});

		await step('Send the message', async () => {
			const sendButton =
				canvas.getByRole('button', { name: /send/i }) || canvas.getByTestId('send-button');

			await userEvent.click(sendButton);
		});

		await step('Verify message appears in chat', async () => {
			await waitFor(() => {
				expect(canvas.getByText('What is SvelteKit?')).toBeVisible();
			});
		});

		await step('Verify AI response appears', async () => {
			await waitFor(
				() => {
					expect(canvas.getByText(/That\'s a great question/i)).toBeVisible();
				},
				{ timeout: 5000 }
			);
		});
	}
};

export const CreateNewChat: Story = {
	parameters: {
		msw: {
			handlers: [
				http.get('/api/history', () => {
					return HttpResponse.json(mockChats);
				})
			]
		}
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify existing chat history is visible', async () => {
			await waitFor(() => {
				expect(canvas.getByText('AI Discussion')).toBeVisible();
			});
		});

		await step('Click new chat button', async () => {
			const newChatButton =
				canvas.getByRole('button', { name: /new.*chat/i }) || canvas.getByTestId('new-chat-button');

			await userEvent.click(newChatButton);
		});

		await step('Verify empty chat state', async () => {
			await waitFor(() => {
				const input =
					canvas.getByPlaceholderText(/ask anything/i) || canvas.getByTestId('message-input');
				expect(input).toHaveValue('');
			});
		});
	}
};

export const UploadFileInNewChat: Story = {
	parameters: {
		msw: {
			handlers: [
				http.post('/api/files/upload', async ({ request }) => {
					const formData = await request.formData();
					const file = formData.get('file');

					if (!file || !(file instanceof File)) {
						return HttpResponse.json({ error: 'No file provided' }, { status: 400 });
					}

					await new Promise((resolve) => setTimeout(resolve, 200));

					return HttpResponse.json({
						url: `https://example.com/uploads/${file.name}`,
						pathname: file.name,
						contentType: file.type,
						size: file.size
					});
				})
			]
		}
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Upload a file', async () => {
			const fileInput = canvas.getByTestId('file-input') || canvas.getByLabelText(/upload.*file/i);

			const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

			await userEvent.upload(fileInput, file);
		});

		await step('Verify file upload success', async () => {
			await waitFor(() => {
				expect(canvas.getByText(/test\.pdf/i)).toBeVisible();
			});
		});
	}
};

export const SwitchModelBeforeSending: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Open model selector', async () => {
			const modelSelector =
				canvas.getByTestId('model-selector') ||
				canvas.getByRole('combobox', { name: /model/i }) ||
				canvas.getByLabelText(/model/i);

			await userEvent.click(modelSelector);
		});

		await step('Select different model', async () => {
			const modelOption =
				canvas.getByRole('option', { name: /claude/i }) || canvas.getByText(/claude/i).first();

			await userEvent.click(modelOption);
		});

		await step('Verify model selection', async () => {
			await waitFor(() => {
				expect(canvas.getByText(/claude/i)).toBeVisible();
			});
		});

		await step('Send message with selected model', async () => {
			const input =
				canvas.getByPlaceholderText(/ask anything/i) || canvas.getByTestId('message-input');

			await userEvent.type(input, 'Test message');

			const sendButton = canvas.getByRole('button', { name: /send/i });
			await userEvent.click(sendButton);
		});
	}
};

export const ReceiveAIResponse: Story = {
	parameters: {
		msw: {
			handlers: [
				http.post('/api/chat', async ({ request }) => {
					const { messages: _messages } = await request.json();

					const stream = new ReadableStream({
						start(controller) {
							const chunks = [
								'data: {"id":"msg-stream","role":"assistant","content":"SvelteKit","parts":[{"type":"text","text":"SvelteKit"}]}\n\n',
								'data: {"id":"msg-stream","role":"assistant","content":"SvelteKit is","parts":[{"type":"text","text":"SvelteKit is"}]}\n\n',
								'data: {"id":"msg-stream","role":"assistant","content":"SvelteKit is a","parts":[{"type":"text","text":"SvelteKit is a"}]}\n\n',
								'data: {"id":"msg-stream","role":"assistant","content":"SvelteKit is a framework","parts":[{"type":"text","text":"SvelteKit is a framework"}]}\n\n',
								'data: {"id":"msg-stream","role":"assistant","content":"SvelteKit is a framework for building","parts":[{"type":"text","text":"SvelteKit is a framework for building"}]}\n\n',
								'data: {"id":"msg-stream","role":"assistant","content":"SvelteKit is a framework for building web applications.","parts":[{"type":"text","text":"SvelteKit is a framework for building web applications."}]}\n\n',
								'data: [DONE]\n\n'
							];

							let index = 0;
							const sendChunk = () => {
								if (index < chunks.length) {
									controller.enqueue(new TextEncoder().encode(chunks[index]));
									index++;
									setTimeout(sendChunk, 200);
								} else {
									controller.close();
								}
							};
							sendChunk();
						}
					});

					return new HttpResponse(stream, {
						headers: {
							'Content-Type': 'text/event-stream',
							'Cache-Control': 'no-cache',
							Connection: 'keep-alive'
						}
					});
				})
			]
		}
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Send message that triggers streaming', async () => {
			const input =
				canvas.getByPlaceholderText(/ask anything/i) || canvas.getByTestId('message-input');

			await userEvent.type(input, 'Explain streaming responses');

			const sendButton = canvas.getByRole('button', { name: /send/i });
			await userEvent.click(sendButton);
		});

		await step('Observe streaming response building up', async () => {
			await waitFor(() => {
				expect(canvas.getByText(/SvelteKit/i)).toBeVisible();
			});

			await waitFor(() => {
				expect(canvas.getByText(/SvelteKit is a framework/i)).toBeVisible();
			});

			await waitFor(
				() => {
					expect(
						canvas.getByText(/SvelteKit is a framework for building web applications/i)
					).toBeVisible();
				},
				{ timeout: 3000 }
			);
		});
	}
};

export const ViewChatHistory: Story = {
	parameters: {
		msw: {
			handlers: [
				http.get('/api/history', () => {
					return HttpResponse.json(mockChats);
				})
			]
		}
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Open sidebar to view chat history', async () => {
			const sidebarToggle =
				canvas.getByTestId('sidebar-toggle') || canvas.getByRole('button', { name: /menu/i });

			await userEvent.click(sidebarToggle);
		});

		await step('Verify chat history is displayed', async () => {
			await waitFor(() => {
				expect(canvas.getByText('AI Discussion')).toBeVisible();
				expect(canvas.getByText('Code Help')).toBeVisible();
			});
		});

		await step('Navigate to different chat', async () => {
			const chatLink =
				canvas.getByRole('link', { name: /code help/i }) || canvas.getByText('Code Help').first();

			await userEvent.click(chatLink);
		});

		await step('Verify navigation occurred', async () => {
			await waitFor(() => {
				expect(canvas.queryByText('Code Help')).toBeVisible();
			});
		});
	}
};

export const ErrorState: Story = {
	parameters: {
		msw: {
			handlers: [
				http.post('/api/chat', () => {
					return new HttpResponse(null, { status: 500 });
				})
			]
		}
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Send message that will fail', async () => {
			const input =
				canvas.getByPlaceholderText(/ask anything/i) || canvas.getByTestId('message-input');

			await userEvent.type(input, 'This will fail');

			const sendButton = canvas.getByRole('button', { name: /send/i });
			await userEvent.click(sendButton);
		});

		await step('Verify error message appears', async () => {
			await waitFor(
				() => {
					expect(
						canvas.getByText(/error/i) ||
							canvas.getByText(/failed/i) ||
							canvas.getByText(/something went wrong/i)
					).toBeVisible();
				},
				{ timeout: 3000 }
			);
		});
	}
};

export const LoadingState: Story = {
	parameters: {
		msw: {
			handlers: [
				http.post('/api/chat', async () => {
					await new Promise((resolve) => setTimeout(resolve, 3000));
					return HttpResponse.json({
						id: 'msg-slow',
						role: 'assistant',
						content: 'Slow response',
						parts: [{ type: 'text', text: 'Slow response' }]
					});
				})
			]
		}
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Send message', async () => {
			const input =
				canvas.getByPlaceholderText(/ask anything/i) || canvas.getByTestId('message-input');

			await userEvent.type(input, 'Test message');

			const sendButton = canvas.getByRole('button', { name: /send/i });
			await userEvent.click(sendButton);
		});

		await step('Verify loading state appears', async () => {
			await waitFor(() => {
				expect(
					canvas.getByText(/loading/i) ||
						canvas.getByText(/thinking/i) ||
						canvas.getByRole('status')
				).toBeVisible();
			});
		});
	}
};
