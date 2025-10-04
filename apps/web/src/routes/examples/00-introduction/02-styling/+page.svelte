<script>
	let colorful = $state(false);
</script>

<p data-testid="styled-text">Styled!</p>

<button onclick={() => (colorful = !colorful)} data-testid="toggle-button">
	Toggle {colorful ? 'normal' : 'colorful'} style
</button>

<style>
	p {
		color: purple;
		font-family: 'Comic Sans MS', cursive;
		font-size: 2em;
		transition: all 0.3s ease;
	}

	.colorful {
		background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: rainbow 2s linear infinite;
	}

	@keyframes rainbow {
		0% {
			filter: hue-rotate(0deg);
		}
		100% {
			filter: hue-rotate(360deg);
		}
	}
</style>
