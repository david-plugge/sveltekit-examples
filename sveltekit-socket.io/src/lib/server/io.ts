import { Server } from 'socket.io';

export const io = new Server<ClientToServerEvents, ServerToClientEvents, ServerToServerEvents>();

io.on('connection', (socket) => {
	console.log('connection', socket.id);

	socket.emit('test');
});

export interface ServerToClientEvents {
	test(): void;
}
export interface ClientToServerEvents {}
export interface ServerToServerEvents {}
export interface SocketData {}
