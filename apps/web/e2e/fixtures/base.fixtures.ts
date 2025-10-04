import { test as base } from '@playwright/test';
import fs from 'fs';
import path from 'path';

type BaseFixtures = {
	errorLogger: void;
	consoleMonitor: void;
};

export const baseTest = base.extend<BaseFixtures>({
	errorLogger: [
		async ({ page }, use, testInfo) => {
			const logs: Array<{ type: string; message: string; timestamp: string }> = [];
			const errors: Error[] = [];

			page.on('console', (msg) => {
				if (msg.type() === 'error') {
					logs.push({
						type: 'CONSOLE_ERROR',
						message: msg.text(),
						timestamp: new Date().toISOString()
					});
				}
			});

			page.on('pageerror', (error) => {
				errors.push(error);
				logs.push({
					type: 'PAGE_ERROR',
					message: `${error.message}\n${error.stack}`,
					timestamp: new Date().toISOString()
				});
			});

			page.on('requestfailed', (request) => {
				logs.push({
					type: 'REQUEST_FAILED',
					message: `${request.url()}: ${request.failure()?.errorText || 'Unknown'}`,
					timestamp: new Date().toISOString()
				});
			});

			page.on('response', (response) => {
				if (response.status() >= 400) {
					logs.push({
						type: 'HTTP_ERROR',
						message: `${response.status()} ${response.statusText()}: ${response.url()}`,
						timestamp: new Date().toISOString()
					});
				}
			});

			await use();

			if (testInfo.status !== 'passed' && (logs.length > 0 || errors.length > 0)) {
				const logDir = path.join(testInfo.outputDir, 'logs');
				await fs.promises.mkdir(logDir, { recursive: true });

				const logFile = path.join(logDir, 'error-logs.txt');
				const logContent = [
					'═══════════════════════════════════════════════════════════',
					`❌ TEST FAILURE REPORT`,
					'═══════════════════════════════════════════════════════════',
					`📝 Test: ${testInfo.title}`,
					`📂 File: ${testInfo.file}`,
					`⏱️  Duration: ${testInfo.duration}ms`,
					`🕐 Time: ${new Date().toISOString()}`,
					`🌐 Browser: ${testInfo.project.name}`,
					`📊 Status: ${testInfo.status}`,
					'',
					'───────────────────────────────────────────────────────────',
					'📋 CAPTURED LOGS',
					'───────────────────────────────────────────────────────────',
					...logs.map((log) => `[${log.timestamp}] [${log.type}]\n  ${log.message}\n`),
					'',
					'───────────────────────────────────────────────────────────',
					'❗ ERRORS',
					'───────────────────────────────────────────────────────────',
					...errors.map((e) => `${e.message}\n${e.stack}\n`),
					'═══════════════════════════════════════════════════════════'
				].join('\n');

				await fs.promises.writeFile(logFile, logContent, 'utf8');

				testInfo.attachments.push({
					name: 'error-logs',
					contentType: 'text/plain',
					path: logFile
				});

				console.error('\n' + logContent);
			}
		},
		{ auto: true }
	],

	consoleMonitor: [
		async ({ page }, use, testInfo) => {
			const consoleMessages: Array<{
				type: string;
				text: string;
				timestamp: string;
				url: string;
			}> = [];

			page.on('console', (msg) => {
				consoleMessages.push({
					type: msg.type(),
					text: msg.text(),
					timestamp: new Date().toISOString(),
					url: page.url()
				});
			});

			await use();

			if (testInfo.status !== 'passed' && consoleMessages.length > 0) {
				const consoleLog = consoleMessages
					.map((m) => `[${m.timestamp}] [${m.type.toUpperCase()}] [${m.url}]\n  ${m.text}\n`)
					.join('\n');

				testInfo.attach('console-logs', {
					body: consoleLog,
					contentType: 'text/plain'
				});
			}
		},
		{ auto: true }
	]
});

export { expect } from '@playwright/test';
