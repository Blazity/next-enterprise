import { createOpenAI } from '@ai-sdk/openai';
import { generateText, streamText, generateObject, customProvider } from 'ai';
import { env } from '$env/dynamic/private';
import type { CoreMessage } from 'ai';

const openrouter = createOpenAI({
	apiKey: env.OPENROUTER_API_KEY || '',
	baseURL: 'https://openrouter.ai/api/v1'
});

export const defaultModel = openrouter('openai/gpt-3.5-turbo');
export const advancedModel = openrouter('anthropic/claude-3.5-sonnet');

export const myProvider = customProvider({
	languageModels: {
		'chat-model': openrouter('openai/gpt-3.5-turbo'),
		'chat-model-reasoning': openrouter('anthropic/claude-3.5-sonnet'),
		'title-model': openrouter('openai/gpt-3.5-turbo'),
		'artifact-model': openrouter('openai/gpt-4-turbo')
	}
});

export async function generateAIText(
	prompt: string,
	model: string = 'openai/gpt-3.5-turbo'
): Promise<string> {
	const { text } = await generateText({
		model: openrouter(model),
		prompt
	});

	return text;
}

export async function generateAIChat(
	messages: CoreMessage[],
	model: string = 'openai/gpt-3.5-turbo'
): Promise<string> {
	const { text } = await generateText({
		model: openrouter(model),
		messages
	});

	return text;
}

export async function streamAIText(prompt: string, model: string = 'openai/gpt-3.5-turbo') {
	return streamText({
		model: openrouter(model),
		prompt
	});
}

export async function streamAIChat(
	messages: CoreMessage[],
	model: string = 'openai/gpt-3.5-turbo'
) {
	return streamText({
		model: openrouter(model),
		messages
	});
}

export async function generateStructuredOutput<T>(
	prompt: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	schema: any,
	model: string = 'openai/gpt-3.5-turbo'
): Promise<T> {
	const { object } = await generateObject({
		model: openrouter(model),
		schema,
		prompt
	});

	return object as T;
}

export { openrouter };
