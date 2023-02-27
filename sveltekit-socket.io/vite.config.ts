import type { HandleUpgrade } from '@sveltejs/kit/node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { appendFileSync } from 'fs';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'websockets',
			configureServer(vite) {
				vite.httpServer?.on('upgrade', async (req, socket, head) => {
					// ignore vite-hmr connections
					if (req.headers['sec-websocket-protocol'] === 'vite-hmr') {
						return;
					}

					const { handleUpgrade }: { handleUpgrade?: HandleUpgrade } = await vite.ssrLoadModule(
						'src/hooks.server.ts'
					);

					handleUpgrade?.(req, socket, head);
				});
			},
			closeBundle() {
				appendFileSync('build/index.js', `\nglobalThis.setupServer?.(server.server);\n`, 'utf8');
			}
		}
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
