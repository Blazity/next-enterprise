<script lang="ts">
	let { name, version, speed, website } = $props();
</script>

<p>
	The <code>{name}</code> package is {speed} fast. Download version {version} from
	<a href="https://www.npmjs.com/package/svelte" rel="noopener noreferrer" target="_blank">npm</a>
	and <a href={website} rel="noopener noreferrer" target="_blank">learn more here</a>
</p>
