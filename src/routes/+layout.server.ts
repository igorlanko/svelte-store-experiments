import type { LayoutServerLoad } from './$types'
import { getAppEnv, getApiUrl, getAppUrl } from '$lib/getEnvs'

export const load: LayoutServerLoad = async () => {
	return {
		APP_ENV: getAppEnv(),
		API_URL: getApiUrl(),
		APP_URL: getAppUrl()
	}
}
