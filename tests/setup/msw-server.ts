let server: any = null;

async function getServer() {
	if (!server) {
		const { setupServer } = await import('msw/node');
		const { handlers } = await import('../../src/mocks/handlers');
		server = setupServer(...handlers);
	}
	return server;
}

export async function setupMSW() {
	const mswServer = await getServer();
	mswServer.listen({ onUnhandledRequest: 'warn' });
	return mswServer;
}

export async function resetMSW() {
	const mswServer = await getServer();
	mswServer.resetHandlers();
}

export async function teardownMSW() {
	const mswServer = await getServer();
	mswServer.close();
}
