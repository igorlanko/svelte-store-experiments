<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte'
	import { isLoading } from '$lib/stores/products'
	import ProductCategories from './ProductCategories.svelte'
	const dispatch = createEventDispatcher()

	export let products

	let loadMoreTriggerEl: HTMLDivElement

	let observer: IntersectionObserver
	onMount(() => {
		observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// loadMore()
					dispatch('loadMore')
				}
			})
		})

		observer.observe(loadMoreTriggerEl)
	})

	onDestroy(() => {
		if (observer) observer.disconnect()
	})
</script>

<div class="mt-4 grid grid-cols-2 gap-x-4 gap-y-24 lg:grid-cols-4">
	{#each products as product}
		<div class="border-t dark:border-stone-700">
			<a
				class="group relative active:top-px"
				href={`/products/${product.id}`}
				on:click={(event) => dispatch('openProduct', event)}
			>
				<img
					class="max-h-48 group-hover:opacity-80"
					src={product.thumbnail}
					alt={product.title}
				/>
				<header>
					<h2 class="group-hover:underline">{product.title}</h2>
					<span>{product.price}</span>
				</header>
			</a>
			<ProductCategories {product} />
		</div>
	{/each}
	{#if $isLoading}
		<div class="h-16 w-16 animate-ping self-center rounded-full bg-gray-200"></div>
	{/if}
	<div bind:this={loadMoreTriggerEl}></div>
</div>
