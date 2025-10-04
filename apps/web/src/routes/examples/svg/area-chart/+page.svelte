<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	import { areaChartData as points } from '$data';

	const yTicks = [0, 2, 4, 6, 8];
	const xTicks = [1980, 1990, 2000, 2010];
	const padding = { top: 20, right: 15, bottom: 20, left: 25 };

	let width = $state(500);
	let height = $state(200);

	function formatMobile(tick: number): string {
		return "'" + tick.toString().slice(-2);
	}
	let minX = $derived(points[0].year);
	let maxX = $derived(points[points.length - 1].year);
	let xScale = $derived(
		scaleLinear()
			.domain([minX, maxX])
			.range([padding.left, width - padding.right])
	);
	let yScale = $derived(
		scaleLinear()
			.domain([Math.min.apply(null, yTicks), Math.max.apply(null, yTicks)])
			.range([height - padding.bottom, padding.top])
	);
	let path = $derived(`M${points.map((p) => `${xScale(p.year)},${yScale(p.value)}`).join('L')}`);
	let area = $derived(`${path}L${xScale(maxX)},${yScale(0)}L${xScale(minX)},${yScale(0)}Z`);
</script>

<h2>Arctic sea ice minimum</h2>

<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
	<svg>
		<g class="axis y-axis" transform="translate(0, {padding.top})">
			{#each yTicks as tick}
				<g class="tick tick-{tick}" transform="translate(0, {yScale(tick) - padding.bottom})">
					<line x2="100%" />
					<text y="-4">{tick} {tick === 8 ? ' million sq km' : ''}</text>
				</g>
			{/each}
		</g>

		<g class="axis x-axis">
			{#each xTicks as tick}
				<g class="tick tick-{tick}" transform="translate({xScale(tick)},{height})">
					<line y1="-{height}" y2="-{padding.bottom}" x1="0" x2="0" />
					<text y="-2">{width > 380 ? tick : formatMobile(tick)}</text>
				</g>
			{/each}
		</g>

		<path class="path-area" d={area} />
		<path class="path-line" d={path} />
	</svg>
</div>

<p>
	Average September extent. Source: <a
		href="https://nsidc.org"
		target="_blank"
		rel="noopener noreferrer">NSIDC/NASA</a
	>
</p>

<style>
	.chart,
	h2,
	p {
		width: 100%;
		max-width: 500px;
		margin-left: auto;
		margin-right: auto;
	}

	svg {
		position: relative;
		width: 100%;
		height: 200px;
		overflow: visible;
	}

	.tick {
		font-size: 0.725em;
		font-weight: 200;
	}

	.tick line {
		stroke: #888;
		stroke-dasharray: 2;
	}

	.tick text {
		fill: #888;
		text-anchor: start;
	}

	.tick.tick-0 line {
		stroke-dasharray: 0;
	}

	.x-axis .tick text {
		text-anchor: middle;
	}

	.path-line {
		fill: none;
		stroke: rgb(0, 100, 100);
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2;
	}

	.path-area {
		fill: rgba(0, 100, 100, 0.2);
	}
</style>
