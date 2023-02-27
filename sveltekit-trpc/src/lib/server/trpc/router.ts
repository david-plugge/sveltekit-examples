import { observable } from '@trpc/server/observable';
import { t } from './t';

export const router = t.router({
	greeting: t.procedure.query(async () => {
		await new Promise((res) => setTimeout(res, 1000));
		return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`;
	}),
	updates: t.procedure.subscription(() => {
		return observable<{ timestamp: number }>((emit) => {
			const interval = setInterval(() => {
				emit.next({
					timestamp: Date.now()
				});
			}, 1000);

			return () => {
				clearInterval(interval);
			};
		});
	})
});

export type Router = typeof router;
