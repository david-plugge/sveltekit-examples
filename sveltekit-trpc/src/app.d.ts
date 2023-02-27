import { IncomingMessage } from 'http';
import { Duplex } from 'stream';
import { Router } from '$lib/server/trpc/router';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			trpc: ReturnType<Router['createCaller']>;
		}
		interface PageData {
			trpc: CreateTRPCProxyClient<Router>;
		}
		// interface Platform {}
	}

	namespace globalThis {
		// eslint-disable-next-line no-var
		var setupServer: (server: import('http').Server) => void;
	}
}

declare module '@sveltejs/kit/node' {
	type HandleUpgrade = (req: IncomingMessage, socket: Duplex, head: Buffer) => void;
}
