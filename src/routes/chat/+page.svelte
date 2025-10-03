<script lang="ts">
	import Chat from '$lib/components/chat.svelte';

	let { data } = $props();
</script>

<Chat chat={undefined} initialMessages={[]} readonly={false} user={data.user} />
<!-- TODO <DataStreamHandler {id} /> -->
