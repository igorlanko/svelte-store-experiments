import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const response = await fetch('https://dummyjson.com/products/category/furniture', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		}
	})

	if (!response.ok) {
		error(400, 'Failed to fetch products')
	}

	const data = await response.json()

	return {
		products: data.products,
	}
}