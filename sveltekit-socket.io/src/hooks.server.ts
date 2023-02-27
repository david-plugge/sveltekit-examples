import type { HandleUpgrade } from '@sveltejs/kit/node';
import { sequence } from '@sveltejs/kit/hooks';
import { dev } from '$app/environment';
import { io } from '$lib/server/io';

export const handle = sequence(async ({ event, resolve }) => {
	event.locals.io = io;

	return resolve(event);
});

export const handleUpgrade: HandleUpgrade = (req, socket, head) => {
	// @ts-expect-error missing engine.io types
	io.engine.handleUpgrade(req, socket, head);
};

if (dev) {
	// we need to create dummy http server to initialize socket.io
	const { createServer } = await import('http');
	io.attach(createServer());
} else {
	globalThis.setupServer = (server) => {
		io.attach(server);
	};
}
