import { browser } from '$app/environment';
import type { Router } from '$lib/server/trpc/router';
import { createTRPCClient } from '$lib/trpc';
import type { CreateTRPCProxyClient } from '@trpc/client';
import type { LayoutLoad } from './$types';

let globalTrpc: CreateTRPCProxyClient<Router>;

export const load = (async ({ fetch }) => {
	const trpc = globalTrpc ?? createTRPCClient({ fetch, ws: browser });
	if (browser) globalTrpc = trpc;

	return {
		trpc
	};
}) satisfies LayoutLoad;
