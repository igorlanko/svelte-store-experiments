/* 
	Vercel environment variables are not available on the client,
	so in order to retrieve system variables related to deployment,
	PUBLIC_ variables are left empty on Vercel.

	Then we use this at +layout.server.ts level to return to both client & server.
*/

import { VERCEL_ENV, VERCEL_URL } from '$env/static/private'
import { PUBLIC_APP_ENV, PUBLIC_APP_URL, PUBLIC_API_URL } from '$env/static/public'

export const getAppUrl = () => {
	const APP_URL = PUBLIC_APP_URL ? PUBLIC_APP_URL : `https://${VERCEL_URL}`
	return APP_URL
}

export const getApiUrl = () => {
	const API_URL = PUBLIC_API_URL ? PUBLIC_API_URL : `https://${VERCEL_URL}/api`
	return API_URL
}

export const getAppEnv = () => {
	const APP_ENV = PUBLIC_APP_ENV ? PUBLIC_APP_ENV : VERCEL_ENV
	return APP_ENV
}
