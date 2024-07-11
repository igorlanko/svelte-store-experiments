import { writable, derived } from 'svelte/store'

export const products = writable([])
export const hasNoMoreData = writable(false)
export const isLoading = writable(true)
export const offset = writable(0)
export const canLoadMore = derived(
	[isLoading, hasNoMoreData],
	([$isLoading, $hasNoMoreData]) => !$isLoading && !$hasNoMoreData
)

export const increaseOffset = (nextOffsetValue = 30) => {
	offset.update((offset) => offset + nextOffsetValue)
}

export const setProducts = (initialProducts) => {
	products.set(initialProducts)
	hasNoMoreData.set(initialProducts.length < 30)
}

export const addProducts = (newProducts) => {
	products.update((products) => [...products, ...newProducts])
	hasNoMoreData.set(newProducts.length < 30)
}

export const updateProductCategories = (
	id: string | number,
	category: { title: string; id: string | number }
) => {
	products.update((currentProducts) => {
		return currentProducts.map((product) => {
			if (product.id === id) {
				if (!product.categories) {
					product.categories = []
				}

				const idx = product.categories.findIndex((c) => c.title === category.title && c.id === null)

				if (idx !== -1) {
					// Update existing category with new ID
					product.categories[idx].id = category.id
				} else {
					product.categories.push(category)
				}

				return product
			}
			return product
		})
	})
}

export const clearProducts = () => {
	products.set([])
	offset.set(0)
	hasNoMoreData.set(false)
	isLoading.set(false)
}
