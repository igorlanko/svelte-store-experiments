import { writable } from 'svelte/store'

export const products = writable([])

export const hasNoMoreData = writable(false)
export const isLoading = writable(false)

export const offset = writable(0)

export const increaseOffset = () => {
	offset.update((offset) => offset + 30)
}

export const setProducts = (initialProducts) => {
	products.set(initialProducts)
	hasNoMoreData.set(initialProducts.length < 30)
}

export const addProducts = (newProducts) => {
	products.update((products) => [...products, ...newProducts])
	hasNoMoreData.set(newProducts.length < 30)
	isLoading.set(false)
}

export const getProducts = () => {
	return products
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
