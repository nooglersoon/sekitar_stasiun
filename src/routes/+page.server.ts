import { MAPBOX_API_KEY } from '$env/dynamic/private'

export async function load() {
  return { MAPBOX_API_KEY }
}
