// Types
import { type Handle } from '@sveltejs/kit'

// ENV
import { VERCEL_AUTOMATION_BYPASS_SECRET } from '$env/static/private'
import { getAppEnv, getAppUrl, getApiUrl } from '$lib/getEnvs'
const APP_ENV = getAppEnv()
const APP_URL = getAppUrl()
const API_URL = getApiUrl()

export const handle: Handle = async ({ event, resolve }) => {
	// CORS
	const origin = event.request.headers.get('origin') || null
	const allowedOrigins = [API_URL, APP_URL]

	// Bypass Vercel's protection if it's preview environment
	// if (APP_ENV === 'preview') {
	// 	console.log('Bypassing Vercel protection for request:', event.request.url)

	// 	// Create new request with the bypass header
	// 	const newRequest = new Request(event.request, {
	// 		headers: new Headers(event.request.headers)
	// 	})
	// 	newRequest.headers.set('x-vercel-protection-bypass', VERCEL_AUTOMATION_BYPASS_SECRET)

	// 	// Log the new request without the cookie header
	// 	const { headers, ...newRequestWithoutHeaders } = newRequest
	// 	const headersWithoutCookies = new Headers(headers)
	// 	headersWithoutCookies.delete('cookie')
	// 	console.log('New request with the bypass header (without fwd cookies):', {
	// 		...newRequestWithoutHeaders,
	// 		headers: headersWithoutCookies
	// 	})

	// 	// Use the new request
	// 	event.request = newRequest
	// }

	// CORS for API routes since CSRF disabled in `svelte.config.js`
	// and currently it's not possible to allow specific origins
	// https://snippets.khromov.se/configure-cors-in-sveltekit-to-access-your-api-routes-from-a-different-host/
	if (event.url.pathname.startsWith('/api')) {
		console.log('event request coming from url:', event.request.url)

		if (event.request.method === 'OPTIONS') {
			if (origin && allowedOrigins.includes(origin)) {
				return new Response(null, {
					headers: {
						'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
						'Access-Control-Allow-Origin': origin,
						'Access-Control-Allow-Headers': '*'
					}
				})
			} else {
				console.log('CSRF in hooks failed because origin is missing or not allowed:', origin)
			}
		}

		return resolve(event)
	}

	// CSRF for all POST requests since it's disabled in `svelte.config.js`
	if (event.request.method === 'POST') {
		// Check if the origin is allowed
		if (!allowedOrigins.includes(origin)) {
			console.log('CSRF in hooks failed: origin not allowed.', origin)
			return new Response('Invalid origin.', { status: 403 })
		}
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range'
		}
	})
}
