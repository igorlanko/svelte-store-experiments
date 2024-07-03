import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id

	const response = await fetch(`https://dummyjson.com/products/${id}`)
	
	if (!response.ok) {
		error(500, 'Failed to fetch product')
	}
	
	const product = await response.json()

	return {
		product
	}
};