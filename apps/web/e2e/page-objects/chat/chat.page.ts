import { Page, Locator, expect } from '@playwright/test';

export class ChatPage {
	readonly page: Page;
	readonly messageInput: Locator;
	readonly sendButton: Locator;
	readonly messages: Locator;
	readonly newChatButton: Locator;
	readonly sidebar: Locator;
	readonly chatList: Locator;

	constructor(page: Page) {
		this.page = page;
		this.messageInput = page.getByRole('textbox', { name: /message/i });
		this.sendButton = page.getByRole('button', { name: /send/i });
		this.messages = page.locator('[data-testid="chat-message"]');
		this.newChatButton = page.getByRole('button', { name: /new chat/i });
		this.sidebar = page.locator('[data-testid="sidebar"]');
		this.chatList = page.locator('[data-testid="chat-list"]');
	}

	async goto() {
		await this.page.goto('/chat');
		await this.page.waitForLoadState('networkidle');
	}

	async sendMessage(text: string) {
		await this.messageInput.fill(text);
		await this.sendButton.click();
		await expect(this.messages.last()).toContainText(text);
	}

	async createNewChat() {
		await this.newChatButton.click();
		await this.page.waitForURL(/\/chat\/[\w-]+/);
	}

	async getMessageCount(): Promise<number> {
		return await this.messages.count();
	}

	async waitForAIResponse(timeout = 30000) {
		await this.page.waitForSelector('[data-testid="ai-message"]', { timeout });
	}
}
