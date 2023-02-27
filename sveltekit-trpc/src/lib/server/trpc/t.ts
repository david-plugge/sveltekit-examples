import { initTRPC } from '@trpc/server';
import SuperJSON from 'superjson';
import { dev } from '$app/environment';
import type { Context } from './context';

export const t = initTRPC.context<Context>().create({
	transformer: SuperJSON,
	isDev: dev
});
