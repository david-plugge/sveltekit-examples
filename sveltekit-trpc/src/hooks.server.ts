import { sequence } from '@sveltejs/kit/hooks';
import type { HandleUpgrade } from '@sveltejs/kit/node';
import { router, createContext, trpcHandle } from '$lib/server/trpc';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ noServer: true, path: '/trpc' });

export const handle = sequence(
	trpcHandle({
		router,
		createContext,
		ws: {
			wss
		}
	}),
	async ({ event, resolve }) => {
		event.locals.trpc = router.createCaller(await createContext(event));

		return resolve(event);
	}
);

export const handleUpgrade: HandleUpgrade = (req, socket, head) => {
	if (wss.shouldHandle(req)) {
		wss.handleUpgrade(req, socket, head, (client, request) => {
			wss.emit('connection', client, request);
		});
	}
};

globalThis.setupServer = (server) => {
	server.on('upgrade', handleUpgrade);
};
