<script lang="ts">
	import { enhance } from '$app/forms'
	import { products, updateProductCategories } from '$lib/stores/products'

	export let product
</script>

<form
	class="mt-4 flex flex-wrap gap-2"
	method="POST"
	action="/products?/update"
	use:enhance={({ formData }) => {
		// Instant feedback
		let productID = parseInt(formData.get('productID', 10))
		let categoryName = formData.get('categoryName')
		let product = $products.find((product) => product.id === productID)

		updateProductCategories(productID, { title: categoryName, id: null })

		return async ({ update, result }) => {
			await update()

			if (result.type === 'success' && result.data) {
				updateProductCategories(productID, {
					title: result.data?.category?.title,
					id: result.data?.category?.id
				})
			}
		}
	}}
>
	<input
		type="hidden"
		name="productID"
		value={product.id}
	/>
	<input
		class="w-full rounded bg-stone-100 px-2 placeholder-stone-500 md:w-auto dark:bg-stone-800"
		type="text"
		placeholder="Add category"
		name="categoryName"
	/>
	<button
		type="submit"
		class="w-full rounded bg-stone-200 px-2 md:w-auto dark:bg-stone-600 dark:text-stone-300"
	>
		Update
	</button>
</form>
{#if product.categories?.length > 0}
	<div>
		{#each product.categories as category}
			<a
				class="rounded bg-stone-200 px-2 dark:bg-stone-800"
				href={`/categories/${category.id}`}
			>
				{category.title}
			</a>
		{/each}
	</div>
{/if}
