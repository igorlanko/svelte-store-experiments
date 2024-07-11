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
		isLoading,
		offset,
		addProducts,
		increaseOffset,
		canLoadMore
	} from '$lib/stores/products'

	const loadMore = async () => {
		if (!$canLoadMore) {
			return
		}

		isLoading.set(true)

		try {
			const response = await fetch(`${PUBLIC_API_URL}/products?offset=${$offset}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			const responseData = await response.json()

			if (!response.ok) {
				throw new Error(responseData.message)
			}

			addProducts(responseData.products)
			increaseOffset()
		} catch (error) {
			console.error(error)
		} finally {
			isLoading.set(false)
		}
	}

	const openProduct = async (customEvent: CustomEvent) => {
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

	onMount(() => {
		setProducts(data.products)
		increaseOffset()
	})

	onDestroy(() => {
		clearProducts()
	})
</script>

<h1 class="mb-6">All products</h1>

<Products
	products={$products}
	on:openProduct={openProduct}
	on:loadMore={() => {
		console.log('loadMore event caught')
		loadMore()
	}}
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
