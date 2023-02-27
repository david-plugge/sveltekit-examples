import { Server } from 'socket.io';

export const io = new Server<ClientToServerEvents, ServerToClientEvents, ServerToServerEvents>();

io.on('connection', (socket) => {
	console.log('connection', socket.id);

	socket.on('post:create', (text, callback) => {
		// simulate error
		if (Math.random() > 0.8) {
			return callback({
				success: false
			});
		}

		socket.broadcast.emit('post:create', text);
		callback({
			success: true,
			text
		});
	});
});

export interface ServerToClientEvents {
	'post:create'(text: string): void;
}
export interface ClientToServerEvents {
	'post:create'(
		text: string,
		callback: (result: { success: false } | { success: true; text: string }) => void
	): void;
}
export interface ServerToServerEvents {}
export interface SocketData {}
