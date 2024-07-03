<script lang="ts">
	import ProductPage from '$lib/components/ProductPage.svelte'
	import type { PageData } from './$types'

	export let data: PageData
	$: product = data.product
</script>

<ProductPage {product} />
