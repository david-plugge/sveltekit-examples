import { Server, IncomingMessage } from 'node:http';
import { Duplex } from 'node:stream';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			io: typeof import('$lib/server/io').io;
		}
		// interface PageData {}
		// interface Platform {}
	}

	namespace globalThis {
		// eslint-disable-next-line no-var
		var setupServer: (server: Server) => void;
	}
}

declare module '@sveltejs/kit/node' {
	type HandleUpgrade = (req: IncomingMessage, socket: Duplex, head: Buffer) => void;
}
