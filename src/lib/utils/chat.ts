import type { CoreAssistantMessage, CoreToolMessage, CoreMessage } from 'ai';
import type { Message as DBMessage, Document } from '$db/schema';

export function convertToUIMessages(messages: Array<DBMessage>): Array<CoreMessage> {
	return messages.map((message) => {
		const parts = typeof message.parts === 'string' ? JSON.parse(message.parts) : message.parts;
		const textPart = parts.find((p: any) => p.type === 'text');

		return {
			id: message.id,
			role: message.role as 'user' | 'assistant' | 'system',
			content: textPart?.text || ''
		};
	});
}

export function getMostRecentUserMessage(messages: Array<CoreMessage>) {
	const userMessages = messages.filter((message) => message.role === 'user');
	return userMessages.at(-1);
}

export function getDocumentTimestampByIndex(documents: Array<Document>, index: number) {
	if (!documents) return new Date();
	if (index > documents.length) return new Date();

	return documents[index].createdAt;
}

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

export function getTrailingMessageId({
	messages
}: {
	messages: Array<ResponseMessage>;
}): string | null {
	const trailingMessage = messages.at(-1);

	if (!trailingMessage) return null;

	return trailingMessage.id;
}
