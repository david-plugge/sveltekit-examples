import type { Handle, RequestEvent } from '@sveltejs/kit';
import type { HTTPHeaders } from '@trpc/client';
import type { AnyRouter, inferRouterContext } from '@trpc/server';
import { applyWSSHandler, type WSSHandlerOptions } from '@trpc/server/adapters/ws';
import type { ResponseMetaFn } from '@trpc/server/dist/http/internals/types';
import { resolveHTTPResponse } from '@trpc/server/http';

interface TRPCHandleOptions<Router extends AnyRouter> {
	prefix?: string;
	router: Router;
	createContext?: (event: RequestEvent) => Promise<inferRouterContext<Router>>;
	responseMeta?: ResponseMetaFn<Router>;
	ws?: Omit<WSSHandlerOptions<Router>, 'router'>;
}

export function trpcHandle<Router extends AnyRouter>({
	prefix = '/trpc',
	router,
	createContext,
	responseMeta,
	ws
}: TRPCHandleOptions<Router>): Handle {
	if (ws) {
		applyWSSHandler({
			...ws,
			router
		});
	}

	return async ({ event, resolve }) => {
		if (event.url.pathname.startsWith(prefix)) {
			const httpResponse = await resolveHTTPResponse({
				router,
				req: {
					method: event.request.method,
					headers: event.request.headers as unknown as HTTPHeaders,
					query: event.url.searchParams,
					body: await event.request.text()
				},
				path: event.url.pathname.substring(prefix.length + 1),
				createContext: async () => createContext?.(event),
				responseMeta
			});

			return new Response(httpResponse.body, {
				status: httpResponse.status,
				headers: httpResponse.headers as Record<string, string>
			});
		}

		return resolve(event);
	};
}
