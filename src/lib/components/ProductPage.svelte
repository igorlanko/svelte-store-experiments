<script lang="ts">
	export let product

	const goBack = () => {
		history.back()
	}
</script>

<svelte:window
	on:keydown={(event) => {
		event.key === 'Escape' && goBack()
	}}
/>

<div class="mx-auto flex max-w-2xl flex-col gap-x-10 px-4 md:flex-row">
	<div class="w-full md:w-1/2">
		<img
			class="max-h-96"
			src={product.images[0]}
			alt={product.title}
		/>
	</div>
	<aside class="mt-10 w-full md:w-1/2 dark:text-stone-400">
		<button
			on:click={goBack}
			class="text-gray-500"
			autofocus
		>
			Back to products
		</button>
		<h1 class="mb-4 mt-2">{product.title}</h1>
		<p class="mb-4">{product.description}</p>
		<span class="text-2xl font-bold">{product.price}</span>
	</aside>
</div>
