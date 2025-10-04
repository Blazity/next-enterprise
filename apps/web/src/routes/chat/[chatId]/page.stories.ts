import type { Meta, StoryObj } from '@storybook/sveltekitkit';
import { expect, within } from '@storybook/test';
import Page from './+page.svelte';
import { mockUser, mockMessages, mockChats } from '$mocks/data';

const meta = {
	title: 'Pages/Chat/ExistingChat',
	component: Page,
	parameters: {
		layout: 'fullscreen',
		sveltekit_experimental: {
			stores: {
				page: {
					data: {
						user: mockUser,
						chat: mockChats[0],
						messages: mockMessages
					},
					params: { chatId: 'chat-1' },
					url: new URL('http://localhost:5173/chat/chat-1'),
					route: { id: '/chat/[chatId]' }
				}
			}
		}
	}
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChatWithMessages: Story = {
	parameters: {
		msw: {
			handlers: [
				http.get('/api/chat/chat-1', () => {
					return HttpResponse.json({
						chat: mockChats[0],
						messages: mockMessages
					});
				})
			]
		}
	}
};

export const SendMessageInExistingChat: Story = {
	parameters: {
		msw: {
			handlers: [
				http.get('/api/chat/chat-1', () => {
					return HttpResponse.json({
						chat: mockChats[0],
						messages: mockMessages
					});
				}),
				http.post('/api/chat', async ({ request }) => {
					const { messages: _messages } = await request.json();
					await new Promise((resolve) => setTimeout(resolve, 300));

					return HttpResponse.json({
						id: 'msg-new',
						role: 'assistant',
						content: 'I understand your follow-up question. Let me provide a detailed answer...',
						parts: [
							{
								type: 'text',
								text: 'I understand your follow-up question. Let me provide a detailed answer...'
							}
						]
					});
				})
			]
		}
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify existing messages are displayed', async () => {
			await waitFor(() => {
				expect(canvas.getByText('What is SvelteKit?')).toBeVisible();
				expect(canvas.getByText(/SvelteKit is a framework/i)).toBeVisible();
			});
		});

		await step('Send follow-up message', async () => {
			const input =
				canvas.getByPlaceholderText(/ask anything/i) || canvas.getByTestId('message-input');

			await userEvent.type(input, 'How do I create a new project?');

			const sendButton = canvas.getByRole('button', { name: /send/i });
			await userEvent.click(sendButton);
		});

		await step('Verify new message appears', async () => {
			await waitFor(() => {
				expect(canvas.getByText('How do I create a new project?')).toBeVisible();
			});
		});

		await step('Verify AI response to follow-up', async () => {
			await waitFor(
				() => {
					expect(canvas.getByText(/I understand your follow-up/i)).toBeVisible();
				},
				{ timeout: 5000 }
			);
		});
	}
};

export const ReceiveStreamingResponse: Story = {
	parameters: {
		msw: {
			handlers: [
				http.get('/api/chat/chat-1', () => {
					return HttpResponse.json({
						chat: mockChats[0],
						messages: mockMessages
					});
				}),
				http.post('/api/chat', async ({ request }) => {
					const { messages: _messages } = await request.json();

					const stream = new ReadableStream({
						start(controller) {
							const chunks = [
								'data: {"id":"msg-stream","role":"assistant","content":"Let","parts":[{"type":"text","text":"Let"}]}\n\n',
								'data: {"id":"msg-stream","role":"assistant","content":"Let me","parts":[{"type":"text","text":"Let me"}]}\n\n',
								'data: {"id":"msg-stream","role":"assistant","content":"Let me explain","parts":[{"type":"text","text":"Let me explain"}]}\n\n',
								'data: {"id":"msg-stream","role":"assistant","content":"Let me explain step","parts":[{"type":"text","text":"Let me explain step"}]}\n\n',
								'data: {"id":"msg-stream","role":"assistant","content":"Let me explain step by step.","parts":[{"type":"text","text":"Let me explain step by step."}]}\n\n',
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
				expect(canvas.getByText(/Let/i)).toBeVisible();
			});

			await waitFor(() => {
				expect(canvas.getByText(/Let me explain/i)).toBeVisible();
			});

			await waitFor(
				() => {
					expect(canvas.getByText(/Let me explain step by step/i)).toBeVisible();
				},
				{ timeout: 3000 }
			);
		});
	}
};

export const UploadFileInExistingChat: Story = {
	parameters: {
		msw: {
			handlers: [
				http.get('/api/chat/chat-1', () => {
					return HttpResponse.json({
						chat: mockChats[0],
						messages: mockMessages
					});
				}),
				http.post('/api/files/upload', async ({ request }) => {
					const formData = await request.formData();
					const file = formData.get('file');

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

		await step('Upload file in existing conversation', async () => {
			const fileInput = canvas.getByTestId('file-input') || canvas.getByLabelText(/upload.*file/i);

			const file = new File(['test document content'], 'document.pdf', { type: 'application/pdf' });
			await userEvent.upload(fileInput, file);
		});

		await step('Verify file appears in chat', async () => {
			await waitFor(() => {
				expect(canvas.getByText(/document\.pdf/i)).toBeVisible();
			});
		});

		await step('Send message with attached file', async () => {
			const input =
				canvas.getByPlaceholderText(/ask anything/i) || canvas.getByTestId('message-input');

			await userEvent.type(input, 'Please analyze this document');

			const sendButton = canvas.getByRole('button', { name: /send/i });
			await userEvent.click(sendButton);
		});
	}
};

export const SwitchModelMidConversation: Story = {
	parameters: {
		msw: {
			handlers: [
				http.get('/api/chat/chat-1', () => {
					return HttpResponse.json({
						chat: mockChats[0],
						messages: mockMessages
					});
				})
			]
		}
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Open model selector during conversation', async () => {
			const modelSelector =
				canvas.getByTestId('model-selector') || canvas.getByRole('combobox', { name: /model/i });

			await userEvent.click(modelSelector);
		});

		await step('Switch to different model', async () => {
			const modelOption =
				canvas.getByRole('option', { name: /gpt/i }) || canvas.getByText(/gpt/i).first();

			await userEvent.click(modelOption);
		});

		await step('Verify model change', async () => {
			await waitFor(() => {
				expect(canvas.getByText(/gpt/i)).toBeVisible();
			});
		});

		await step('Send message with new model', async () => {
			const input =
				canvas.getByPlaceholderText(/ask anything/i) || canvas.getByTestId('message-input');

			await userEvent.type(input, 'Continue with GPT model');

			const sendButton = canvas.getByRole('button', { name: /send/i });
			await userEvent.click(sendButton);
		});
	}
};

export const ViewChatHistoryNavigation: Story = {
	parameters: {
		msw: {
			handlers: [
				http.get('/api/chat/chat-1', () => {
					return HttpResponse.json({
						chat: mockChats[0],
						messages: mockMessages
					});
				}),
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

export const ReadonlyChatPublicView: Story = {
	parameters: {
		sveltekit_experimental: {
			stores: {
				page: {
					data: {
						user: null,
						chat: { ...mockChats[0], isPublic: true },
						messages: mockMessages
					},
					params: { chatId: 'chat-1' }
				}
			}
		},
		msw: {
			handlers: [
				http.get('/api/chat/chat-1', () => {
					return HttpResponse.json({
						chat: { ...mockChats[0], isPublic: true },
						messages: mockMessages
					});
				})
			]
		}
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify messages are visible in readonly mode', async () => {
			await waitFor(() => {
				expect(canvas.getByText('What is SvelteKit?')).toBeVisible();
				expect(canvas.getByText(/SvelteKit is a framework/i)).toBeVisible();
			});
		});

		await step('Verify input is disabled or hidden', async () => {
			const input =
				canvas.queryByPlaceholderText(/ask anything/i) || canvas.queryByTestId('message-input');

			if (input) {
				expect(input).toBeDisabled();
			} else {
				expect(canvas.queryByRole('textbox')).not.toBeVisible();
			}
		});

		await step('Verify no send button available', async () => {
			const sendButton = canvas.queryByRole('button', { name: /send/i });
			expect(sendButton).not.toBeVisible();
		});
	}
};

export const ErrorLoadingChat: Story = {
	parameters: {
		msw: {
			handlers: [
				http.get('/api/chat/chat-1', () => {
					return new HttpResponse(null, { status: 404 });
				})
			]
		}
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify error message for missing chat', async () => {
			await waitFor(() => {
				expect(
					canvas.getByText(/chat not found/i) ||
						canvas.getByText(/error/i) ||
						canvas.getByText(/not found/i)
				).toBeVisible();
			});
		});
	}
};

export const DeleteChat: Story = {
	parameters: {
		msw: {
			handlers: [
				http.get('/api/chat/chat-1', () => {
					return HttpResponse.json({
						chat: mockChats[0],
						messages: mockMessages
					});
				}),
				http.delete('/api/chat/chat-1', () => {
					return new HttpResponse(null, { status: 200 });
				})
			]
		}
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Open chat menu', async () => {
			const menuButton =
				canvas.getByTestId('chat-menu') || canvas.getByRole('button', { name: /menu/i });

			await userEvent.click(menuButton);
		});

		await step('Click delete option', async () => {
			const deleteOption =
				canvas.getByRole('menuitem', { name: /delete/i }) || canvas.getByText(/delete/i).first();

			await userEvent.click(deleteOption);
		});

		await step('Confirm deletion in dialog', async () => {
			const confirmButton =
				canvas.getByRole('button', { name: /confirm/i }) ||
				canvas.getByRole('button', { name: /delete/i });

			await userEvent.click(confirmButton);
		});

		await step('Verify redirect or success message', async () => {
			await waitFor(() => {
				expect(canvas.getByText(/deleted/i) || canvas.getByText(/success/i)).toBeVisible();
			});
		});
	}
};
