export const DEFAULT_CHAT_MODEL: string = 'openai/gpt-3.5-turbo';

interface ChatModel {
	id: string;
	name: string;
	description: string;
}

export const chatModels: Array<ChatModel> = [
	{
		id: 'openai/gpt-3.5-turbo',
		name: 'GPT-3.5 Turbo',
		description: 'Fast and efficient model for general chat'
	},
	{
		id: 'openai/gpt-4-turbo',
		name: 'GPT-4 Turbo',
		description: 'More capable model with better reasoning'
	},
	{
		id: 'anthropic/claude-3.5-sonnet',
		name: 'Claude 3.5 Sonnet',
		description: 'Advanced reasoning and analysis'
	},
	{
		id: 'anthropic/claude-3-opus',
		name: 'Claude 3 Opus',
		description: 'Most capable Claude model'
	},
	{
		id: 'google/gemini-pro',
		name: 'Gemini Pro',
		description: "Google's advanced AI model"
	}
];
