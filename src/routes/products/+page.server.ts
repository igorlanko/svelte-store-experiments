// Types
import type { Actions, PageServerLoad } from './$types'

// Data
import { error } from '@sveltejs/kit'

// Utils
import { getApiUrl } from '$lib/getEnvs'

export const load: PageServerLoad = async ({ fetch }) => {
	const API_URL = getApiUrl()

	const response = await fetch(`${API_URL}/products`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})

	if (!response.ok) {
		console.error('Failed to fetch products from the API', response)
		error(400, 'Failed to fetch products')
	}

	const data = await response.json()

	return {
		products: data.products
	}
}

export const actions: Actions = {
	update: async ({ request }) => {
		const formData = await request.formData()
		const productID = formData.get('productID')
		const categoryName = formData.get('categoryName')

		const response = await fetch('https://dummyjson.com/http/200', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		})

		if (!response.ok) {
			error(400, 'Failed to fetch product')
		}

		return {
			productID,
			category: {
				id: 123,
				title: categoryName
			}
		}
	}
}
