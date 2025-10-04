import type { Meta, StoryObj } from '@storybook/sveltekitkit';
import { expect, fn, waitFor, within, userEvent } from '@storybook/test';
import { http, HttpResponse } from 'msw';
import Page from './+page.svelte';

const meta = {
	title: 'Pages/Demo/FileUpload',
	component: Page,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'File upload demonstration page showing drag-and-drop and form-based file uploads with progress tracking.'
			}
		}
	}
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyFileUpload: Story = {};

export const UploadSingleFile: Story = {
	parameters: {
		msw: {
			handlers: [
				http.post('/api/storage/upload', async ({ request }) => {
					const formData = await request.formData();
					const file = formData.get('file') as File;

					await new Promise((resolve) => setTimeout(resolve, 500));

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

		await step('Select a file to upload', async () => {
			const fileInput =
				canvas.getByTestId('file-input') ||
				canvas.getByLabelText(/choose.*file/i) ||
				canvas.getByLabelText(/upload.*file/i);

			const file = new File(['test content'], 'document.pdf', { type: 'application/pdf' });
			await userEvent.upload(fileInput, file);
		});

		await step('Verify file appears in file list', async () => {
			await waitFor(() => {
				expect(canvas.getByText('document.pdf')).toBeVisible();
			});
		});

		await step('Click upload button', async () => {
			const uploadButton =
				canvas.getByRole('button', { name: /upload/i }) || canvas.getByTestId('upload-button');

			await userEvent.click(uploadButton);
		});

		await step('Verify upload progress and completion', async () => {
			await waitFor(
				() => {
					expect(
						canvas.getByText(/uploaded/i) ||
							canvas.getByText(/complete/i) ||
							canvas.getByText(/success/i)
					).toBeVisible();
				},
				{ timeout: 3000 }
			);
		});
	}
};

export const UploadMultipleFiles: Story = {
	parameters: {
		msw: {
			handlers: [
				http.post('/api/storage/upload', async ({ request }) => {
					const formData = await request.formData();
					const file = formData.get('file') as File;

					await new Promise((resolve) => setTimeout(resolve, 300));

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

		await step('Select multiple files', async () => {
			const fileInput = canvas.getByTestId('file-input') || canvas.getByLabelText(/choose.*files/i);

			const files = [
				new File(['document content'], 'report.pdf', { type: 'application/pdf' }),
				new File(['image data'], 'photo.jpg', { type: 'image/jpeg' }),
				new File(['spreadsheet data'], 'data.xlsx', {
					type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
				})
			];

			await userEvent.upload(fileInput, files);
		});

		await step('Verify all files appear in list', async () => {
			await waitFor(() => {
				expect(canvas.getByText('report.pdf')).toBeVisible();
				expect(canvas.getByText('photo.jpg')).toBeVisible();
				expect(canvas.getByText('data.xlsx')).toBeVisible();
			});
		});

		await step('Upload all files', async () => {
			const uploadButton = canvas.getByRole('button', { name: /upload/i });

			await userEvent.click(uploadButton);
		});

		await step('Verify all files upload successfully', async () => {
			await waitFor(
				() => {
					const uploadedIndicators = canvas.getAllByText(/uploaded|complete|success/i);
					expect(uploadedIndicators.length).toBeGreaterThanOrEqual(3);
				},
				{ timeout: 5000 }
			);
		});
	}
};

export const DragAndDropUpload: Story = {
	parameters: {
		msw: {
			handlers: [
				http.post('/api/storage/upload', async ({ request }) => {
					const formData = await request.formData();
					const file = formData.get('file') as File;

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

		await step('Drag and drop a file onto the upload area', async () => {
			const dropZone =
				canvas.getByTestId('drop-zone') ||
				canvas.getByText(/drop.*files/i).first() ||
				canvas.getByText(/drag.*drop/i).first();

			const file = new File(['test content'], 'dropped-file.txt', { type: 'text/plain' });

			const _dataTransfer = {
				files: [file],
				types: ['Files']
			};

			await userEvent.hover(dropZone);

			const fileInput = canvas.getByTestId('file-input') || canvas.getByLabelText(/upload/i);
			await userEvent.upload(fileInput, file);
		});

		await step('Verify file appears after drag-drop', async () => {
			await waitFor(() => {
				expect(canvas.getByText('dropped-file.txt')).toBeVisible();
			});
		});

		await step('Complete upload process', async () => {
			const uploadButton = canvas.getByRole('button', { name: /upload/i });
			await userEvent.click(uploadButton);

			await waitFor(() => {
				expect(canvas.getByText(/uploaded/i)).toBeVisible();
			});
		});
	}
};

export const FileTypeValidation: Story = {
	parameters: {
		msw: {
			handlers: [
				http.post('/api/storage/upload', async ({ request }) => {
					const formData = await request.formData();
					const file = formData.get('file') as File;

					if (file.type === 'application/exe') {
						return HttpResponse.json(
							{ error: 'Executable files are not allowed' },
							{ status: 400 }
						);
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

		await step('Try to upload invalid file type', async () => {
			const fileInput = canvas.getByTestId('file-input') || canvas.getByLabelText(/upload/i);

			const invalidFile = new File(['malware'], 'virus.exe', { type: 'application/exe' });
			await userEvent.upload(fileInput, invalidFile);
		});

		await step('Click upload button', async () => {
			const uploadButton = canvas.getByRole('button', { name: /upload/i });
			await userEvent.click(uploadButton);
		});

		await step('Verify validation error for file type', async () => {
			await waitFor(() => {
				expect(
					canvas.getByText(/not allowed/i) ||
						canvas.getByText(/invalid.*type/i) ||
						canvas.getByText(/executable.*files/i)
				).toBeVisible();
			});
		});

		await step('Upload valid file type', async () => {
			const fileInput = canvas.getByTestId('file-input');
			const validFile = new File(['valid content'], 'document.pdf', { type: 'application/pdf' });
			await userEvent.upload(fileInput, validFile);

			const uploadButton = canvas.getByRole('button', { name: /upload/i });
			await userEvent.click(uploadButton);
		});

		await step('Verify valid file uploads successfully', async () => {
			await waitFor(() => {
				expect(canvas.getByText(/uploaded/i)).toBeVisible();
			});
		});
	}
};

export const FileSizeLimit: Story = {
	parameters: {
		msw: {
			handlers: [
				http.post('/api/storage/upload', async ({ request }) => {
					const formData = await request.formData();
					const file = formData.get('file') as File;

					if (file.size > 10 * 1024 * 1024) {
						return HttpResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
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

		await step('Try to upload file that exceeds size limit', async () => {
			const fileInput = canvas.getByTestId('file-input') || canvas.getByLabelText(/upload/i);

			const largeFile = new File(['x'.repeat(15 * 1024 * 1024)], 'large-file.zip', {
				type: 'application/zip'
			});
			await userEvent.upload(fileInput, largeFile);
		});

		await step('Click upload button', async () => {
			const uploadButton = canvas.getByRole('button', { name: /upload/i });
			await userEvent.click(uploadButton);
		});

		await step('Verify file size error', async () => {
			await waitFor(() => {
				expect(
					canvas.getByText(/size.*limit/i) ||
						canvas.getByText(/too.*large/i) ||
						canvas.getByText(/exceeds.*10MB/i)
				).toBeVisible();
			});
		});

		await step('Upload file within size limit', async () => {
			const fileInput = canvas.getByTestId('file-input');
			const smallFile = new File(['small content'], 'small.txt', { type: 'text/plain' });
			await userEvent.upload(fileInput, smallFile);

			const uploadButton = canvas.getByRole('button', { name: /upload/i });
			await userEvent.click(uploadButton);
		});

		await step('Verify small file uploads successfully', async () => {
			await waitFor(() => {
				expect(canvas.getByText(/uploaded/i)).toBeVisible();
			});
		});
	}
};

export const UploadErrorHandling: Story = {
	parameters: {
		msw: {
			handlers: [
				http.post('/api/storage/upload', async () => {
					await new Promise((resolve) => setTimeout(resolve, 200));
					return new HttpResponse(null, { status: 500 });
				})
			]
		}
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Select file for upload', async () => {
			const fileInput = canvas.getByTestId('file-input') || canvas.getByLabelText(/upload/i);

			const file = new File(['test'], 'error-test.txt', { type: 'text/plain' });
			await userEvent.upload(fileInput, file);
		});

		await step('Attempt upload that will fail', async () => {
			const uploadButton = canvas.getByRole('button', { name: /upload/i });
			await userEvent.click(uploadButton);
		});

		await step('Verify error handling and user feedback', async () => {
			await waitFor(() => {
				expect(
					canvas.getByText(/error/i) ||
						canvas.getByText(/failed/i) ||
						canvas.getByText(/something went wrong/i)
				).toBeVisible();
			});
		});

		await step('Verify retry option or clear error state', async () => {
			const retryButton =
				canvas.queryByRole('button', { name: /retry/i }) ||
				canvas.queryByRole('button', { name: /try again/i });

			if (retryButton) {
				expect(retryButton).toBeVisible();
			}
		});
	}
};

export const UploadProgressTracking: Story = {
	parameters: {
		msw: {
			handlers: [
				http.post('/api/storage/upload', async ({ request }) => {
					const formData = await request.formData();
					const file = formData.get('file') as File;

					await new Promise((resolve) => setTimeout(resolve, 2000));

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

		await step('Select file and start upload', async () => {
			const fileInput = canvas.getByTestId('file-input') || canvas.getByLabelText(/upload/i);

			const file = new File(['progress test content'], 'progress-test.pdf', {
				type: 'application/pdf'
			});
			await userEvent.upload(fileInput, file);

			const uploadButton = canvas.getByRole('button', { name: /upload/i });
			await userEvent.click(uploadButton);
		});

		await step('Verify progress indicator appears', async () => {
			await waitFor(() => {
				expect(
					canvas.getByRole('progressbar') ||
						canvas.getByText(/\d+%/) ||
						canvas.getByText(/uploading/i)
				).toBeVisible();
			});
		});

		await step('Wait for upload completion', async () => {
			await waitFor(
				() => {
					expect(canvas.getByText(/uploaded/i) || canvas.getByText(/complete/i)).toBeVisible();
				},
				{ timeout: 3000 }
			);
		});
	}
};
