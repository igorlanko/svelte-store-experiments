// Types
import { type Handle, type HandleFetch } from '@sveltejs/kit'

// ENV
import { VERCEL_AUTOMATION_BYPASS_SECRET } from '$env/static/private'
import { getAppEnv, getAppUrl, getApiUrl } from '$lib/getEnvs'

// Libs

export const handle: Handle = async ({ event, resolve }) => {
	const APP_URL = getAppUrl()
	const API_URL = getApiUrl()

	// CORS
	const origin = event.request.headers.get('origin') || null
	const allowedOrigins = [API_URL, APP_URL]

	// CORS for API routes since CSRF disabled in `svelte.config.js`
	// and currently it's not possible to allow specific origins
	// https://snippets.khromov.se/configure-cors-in-sveltekit-to-access-your-api-routes-from-a-different-host/
	if (event.url.pathname.startsWith('/api')) {
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

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	const APP_ENV = getAppEnv()

	const newRequest = new Request(request, {
		headers: new Headers(request.headers)
	})

	if (APP_ENV === 'preview') {
		// Bypass Vercel's protection if it's preview environment
		newRequest.headers.set('x-vercel-protection-bypass', VERCEL_AUTOMATION_BYPASS_SECRET)
	}

	return fetch(newRequest)
}
