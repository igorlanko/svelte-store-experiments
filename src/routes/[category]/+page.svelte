<script lang="ts">
	import type { PageData } from './$types'
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/stores'
	import { goto, pushState, preloadData } from '$app/navigation'
	import {
		setProducts,
		products,
		clearProducts,
		hasNoMoreData,
		isLoading,
		offset,
		addProducts
	} from '$lib/stores/products'
	import ProductPage from '$lib/components/ProductPage.svelte'
	import Products from '$lib/components/Products.svelte'

	export let data: PageData

	const loadMore = async () => {
		if ($hasNoMoreData || $isLoading) return

		const response = await fetch(
			`https://dummyjson.com/products/category/${$page.params.category}?limit=30&skip=${$offset}`
		)

		if (!response.ok) {
			console.error('Error loading more products')
			return
		}

		const data = await response.json()

		addProducts(data.products)
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

	$: console.log($products)

	onMount(() => {
		setProducts(data.products)
	})

	onDestroy(() => {
		clearProducts()
	})
</script>

<h1>Furniture</h1>

<Products
	products={$products}
	on:openProduct={(event) => openProduct(event)}
	on:loadMore={() => loadMore()}
/>

{#if $page.state.selected}
	<dialog
		class="fixed inset-0 bg-white/95 dark:bg-black/95 w-full h-screen flex justify-center items-center"
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
