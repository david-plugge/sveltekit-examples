<script lang="ts">
	import { trpc } from '$lib/trpc';
	import { onMount } from 'svelte';

	onMount(() => {
		const { unsubscribe } = trpc.updates.subscribe(undefined, {
			onData(value) {
				console.log(value);
			},
			onError(err) {
				console.log('err', err);
			},
			onStarted() {
				console.log('started');
			}
		});
		return unsubscribe;
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
