import { ErrorType } from '../lib/model/ErrorType.ts';

async function tokenValidation(token: string) {
  const url = `https://api.mapbox.com/isochrone/v1/mapbox/walking/106.822858,-6.19341?contours_minutes=10&polygons=true&access_token=${token}`;
  let query = await fetch(url, { method: 'GET' })
  if (query.status === 401 || query.status === 403) {
    // Show apikey form
    return ErrorType.InvalidToken
  } else if (query.status === 200) {
    return null
  }
  // Show modal/toast that service is unavailable at the moment
  return ErrorType.InvalidToken
}

export async function load() {
  // TODO: Change with token from session store
  let mapboxAccessToken = 'pk.eyJ1Ijoicm9iaW5rb2hycyIsImEiOiJjanU5am95bm4xZnZ6NDNrOTRyYTYwdzJzIn0.iMFQgQIlhz36wB3819Xftw'
  let errorResult: ErrorType | null = await tokenValidation(mapboxAccessToken)
  if (errorResult === null) {
    //    redirect(301, '/maps')
  } else {
    return { errorType: errorResult }
  }
}

export const actions = {
  saveToken: async ({ request }) => {
    const formData = await request.formData()
    const apiKey = String(formData.get('api-key'))

    // TODO: Set apikey to session store & call tokenValidation
    let errorResult: ErrorType | null = await tokenValidation(apiKey)

    if (errorResult === null) {
      return { errorResult: null }
    } else {
      return { errorType: errorResult }
    }
  }
  // @ts-ignore
}