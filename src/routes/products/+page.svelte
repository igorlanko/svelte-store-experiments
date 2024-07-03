<script lang="ts">
	// Types
	import type { PageData } from './$types'

	// Data
	import { page } from '$app/stores'
	import { goto, pushState, preloadData } from '$app/navigation'
	import { onMount, onDestroy } from 'svelte'
	export let data: PageData

	// UI
	import ProductPage from '$lib/components/ProductPage.svelte'
	import Products from '$lib/components/Products.svelte'

	// ENV
	import { PUBLIC_API_URL } from '$env/static/public'

	// Utils
	import {
		setProducts,
		products,
		clearProducts,
		hasNoMoreData,
		isLoading,
		offset,
		addProducts,
		increaseOffset
	} from '$lib/stores/products'

	onMount(() => {
		setProducts(data.products)
	})

	onDestroy(() => {
		clearProducts()
	})

	const loadMore = async () => {
		if ($hasNoMoreData || $isLoading) return

		isLoading.set(true)
		increaseOffset()

		const response = await fetch(`${PUBLIC_API_URL}/products?skip=${$offset}`)

		if (!response.ok) {
			console.error('Error loading more products')
			return
		}

		const data = await response.json()

		addProducts(data.products)
		isLoading.set(false)
	}

	const openProduct = async (customEvent) => {
		const event = customEvent.detail
		event.preventDefault()

		const { href } = event.currentTarget
		const result = await preloadData(href)

		if (result.type === 'loaded' && result.status === 200) {
			pushState(href, { selected: result.data.product })
		} else {
			goto(href)
		}
	}
</script>

<h1>All products</h1>

<Products
	products={$products}
	on:openProduct={(event) => openProduct(event)}
	on:loadMore={() => loadMore()}
/>

{#if $page.state.selected}
	<dialog
		class="fixed inset-0 flex h-screen w-full items-center justify-center bg-white/95 dark:bg-black/80"
		open
	>
		<ProductPage product={$page.state.selected} />
		<button
			class="absolute inset-0 -z-[1] cursor-default"
			on:click={() => history.back()}
		>
		</button>
	</dialog>
{/if}
