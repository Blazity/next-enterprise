<script lang="ts">
	interface Circle {
		cx: number;
		cy: number;
		r: number;
	}

	let i = $state(0);
	let undoStack = $state<Circle[][]>([[]]);
	let circles = $state<Circle[]>([]);
	let selected = $state<Circle>();
	let adjusting = $state(false);
	let adjusted = false;

	function handleClick(event: MouseEvent) {
		if (adjusting) {
			adjusting = false;

			if (adjusted) push();
			return;
		}

		const circle: Circle = {
			cx: event.clientX,
			cy: event.clientY,
			r: 50
		};

		circles = circles.concat(circle);
		selected = circle;

		push();
	}

	function adjust(event: Event) {
		if (selected) {
			const target = event.target as HTMLInputElement;
			selected.r = +target.value;
			circles = circles;
			adjusted = true;
		}
	}

	function select(circle: Circle, event: MouseEvent) {
		if (!adjusting) {
			event.stopPropagation();
			selected = circle;
		}
	}

	function push() {
		const newUndoStack = undoStack.slice(0, ++i);
		newUndoStack.push(clone(circles));
		undoStack = newUndoStack;
	}

	function travel(d: number) {
		circles = clone(undoStack[(i += d)]);
		adjusting = false;
	}

	function clone(circles: Circle[]) {
		return circles.map(({ cx, cy, r }) => ({ cx, cy, r }));
	}
</script>

<div class="controls">
	<button type="button" onclick={() => travel(-1)} disabled={i === 0}>undo</button>
	<button type="button" onclick={() => travel(+1)} disabled={i === undoStack.length - 1}
		>redo</button
	>
</div>

<svg onclick={handleClick}>
	{#each circles as circle}
		<circle
			cx={circle.cx}
			cy={circle.cy}
			r={circle.r}
			onclick={(event) => select(circle, event)}
			oncontextmenu={(e) => {
				e.stopPropagation();
				e.preventDefault();
				adjusting = !adjusting;
				if (adjusting) selected = circle;
			}}
			fill={circle === selected ? '#ccc' : 'white'}
		/>
	{/each}
</svg>

{#if adjusting && selected}
	<div class="adjuster">
		<p>adjust diameter of circle at {selected.cx}, {selected.cy}</p>
		<input type="range" value={selected.r} oninput={adjust} />
	</div>
{/if}

<style>
	.controls {
		position: absolute;
		width: 100%;
		text-align: center;
	}

	svg {
		background-color: #eee;
		width: 100%;
		height: 100%;
	}

	circle {
		stroke: black;
	}

	.adjuster {
		position: absolute;
		width: 80%;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 1em;
		text-align: center;
		background-color: rgba(255, 255, 255, 0.7);
		border-radius: 4px;
	}

	input[type='range'] {
		width: 100%;
	}
</style>
