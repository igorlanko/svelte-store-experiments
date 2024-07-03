import type { LayoutServerLoad } from './$types'
import { getAppEnv, getApiUrl, getAppUrl } from '$lib/getEnvs'

export const load: LayoutServerLoad = async () => {
	console.log('APP_ENV', getAppEnv())
	console.log('API_URL', getApiUrl())
	console.log('APP_URL', getAppUrl())

	return {
		APP_ENV: getAppEnv(),
		API_URL: getApiUrl(),
		APP_URL: getAppUrl()
	}
}
