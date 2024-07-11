<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount, tick } from 'svelte'
	import { isLoading, canLoadMore, increaseOffset } from '$lib/stores/products'
	import { MasonryInfiniteGrid } from '@egjs/svelte-infinitegrid'
	import ProductCategories from './ProductCategories.svelte'
	const dispatch = createEventDispatcher()

	export let products

	// Infinite scroll
	let loadMoreTriggerEl: HTMLDivElement
	let observer: IntersectionObserver | null

	const startObserving = () => {
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						dispatch('loadMore')
					}
				})
			},
			{
				root: null,
				rootMargin: '300px',
				threshold: 0.01
			}
		)
		if (loadMoreTriggerEl) {
			observer.observe(loadMoreTriggerEl)
		}
	}

	const stopObserving = () => {
		if (observer) {
			observer.disconnect()
			observer = null
		}
	}

	onMount(async () => {
		await tick()
		
		startObserving()
		increaseOffset()
	})

	onDestroy(() => {
		stopObserving()
	})
</script>

<MasonryInfiniteGrid
	align="left"
	items={products}
	itemBy={(product) => product.id}
	percentage={true}
	on:renderComplete={() => isLoading.set(false)}
	let:visibleItems
>
	{#each visibleItems as product (product.key)}
		<div
			class="lg:px-4] w-[calc(50%-0px)] p-2 px-1 pb-12 md:w-[calc(33.33%-0px)] md:px-2 lg:w-[calc(25%-0px)]"
		>
			<a
				class="group relative flex flex-col items-center rounded-lg bg-stone-800 active:top-px"
				href={`/products/${product.data.id}`}
				on:click={(event) => dispatch('openProduct', event)}
			>
				<img
					class="max-h-48 group-hover:opacity-80"
					src={product.data.thumbnail}
					alt={product.data.title}
				/>
				<header class="text-center">
					<h2 class="group-hover:underline">{product.data.title}</h2>
					<span>{product.data.price}</span>
				</header>
			</a>
			<ProductCategories product={product.data} />
		</div>
	{/each}
</MasonryInfiniteGrid>

{#if !$isLoading && !$canLoadMore && products.length > 0}
	<div class="col-span-4 w-full text-center md:col-span-8 xl:col-span-12">
		<p>That's all!</p>
	</div>
{/if}
{#if $isLoading}
	<div class="col-span-4 flex justify-center md:col-span-8 lg:col-span-12">Loading...</div>
{/if}
<div bind:this={loadMoreTriggerEl}></div>
