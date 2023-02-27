import { browser } from '$app/environment';
import { createTRPCProxyClient, createWSClient, splitLink, wsLink } from '@trpc/client';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import SuperJSON from 'superjson';
import type { Router } from './server/trpc/router';

export const trpc = createTRPCClient({
	ws: browser
});

export function createTRPCClient({
	fetch,
	url = '/trpc',
	ws = false
}: { fetch?: typeof window.fetch; url?: string; ws?: boolean } = {}) {
	return createTRPCProxyClient<Router>({
		transformer: SuperJSON,
		links: [
			splitLink({
				condition(op) {
					return op.type === 'subscription';
				},
				false: httpBatchLink({
					url,
					fetch
				}),
				true: ws
					? wsLink({
							client: createWSClient({
								url: new URL(
									url,
									`${location.protocol === 'http:' ? 'ws:' : 'wss:'}//${location.host}`
								).href
							})
					  })
					: []
			})
		]
	});
}
