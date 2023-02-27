import { onMount } from 'svelte';
import { io, Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from './server/io';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
	transports: ['websocket'],
	withCredentials: true
});

export function wsOn<Ev extends keyof ServerToClientEvents>(
	ev: Ev,
	listener: ServerToClientEvents[Ev]
) {
	return onMount(() => {
		socket.on(ev, listener as any);

		return () => {
			socket.off(ev, listener as any);
		};
	});
}

export function wsOnce<Ev extends keyof ServerToClientEvents>(
	ev: Ev,
	listener: ServerToClientEvents[Ev]
) {
	return onMount(() => {
		socket.on(ev, listener as any);

		return () => {
			socket.off(ev, listener as any);
		};
	});
}
