<script lang="ts">
	import { socket, wsOn } from '$lib/socket';
	import { tick } from 'svelte';
	import { writable } from 'svelte/store';

	let newPost = '';
	let sending = false;
	let error: string | null = null;
	let inputElement: HTMLInputElement;

	const maxRenderedPosts = 100;
	const posts = writable<string[]>([]);

	function addPost(text: string) {
		posts.update(($posts) => {
			$posts.unshift(text);
			if ($posts.length > maxRenderedPosts) {
				$posts.splice(maxRenderedPosts, Infinity);
			}
			return $posts;
		});
	}

	wsOn('post:create', addPost);

	function handleSend() {
		if (!newPost) return;
		sending = true;
		error = null;
		socket.timeout(1000).emit('post:create', newPost, (err, result) => {
			sending = false;
			if (err) {
				error = err.message;
			} else if (!result.success) {
				error = 'Could not send message';
			} else {
				addPost(result.text);
			}
			tick().then(() => inputElement.focus());
		});
		newPost = '';
	}
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleSend();
		}
	}
</script>

<input
	bind:this={inputElement}
	disabled={sending}
	type="text"
	bind:value={newPost}
	on:keydown={handleKeydown}
/>
<button disabled={sending} on:click={handleSend}>Send</button>

{#if error}
	<pre>{JSON.stringify(error, null, 2)}</pre>
{/if}

<div>
	{#each $posts as post}
		<p>{post}</p>
	{/each}
</div>

<style>
	div {
		border: 1px solid #eee;
		padding: 0.5em;
		margin: 0.5em 0;
		display: flex;
		flex-direction: column;
		gap: 0.25em;
		max-height: 800px;
		overflow: auto;
	}
	p {
		padding: 0.5em;
		margin: 0;
		background-color: #eee;
	}
</style>
