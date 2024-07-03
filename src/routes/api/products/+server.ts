import type { RequestHandler } from './$types'
import { json, error } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url }) => {
	const offset = url.searchParams.get('offset') || 0

	const response = await fetch(`https://dummyjson.com/products?limit=30&skip=${offset}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})

	if (!response.ok) {
		error(400, 'Failed to fetch products')
	}

	const data = await response.json()

	return json({
		products: data.products
	})
}
