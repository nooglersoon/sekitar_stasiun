import { MAPBOX_API_KEY } from '$env/static/private'

export async function load() {
  return { MAPBOX_API_KEY }
}
