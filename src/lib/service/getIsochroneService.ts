const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';

export type GetIsochroneRequest = {
  transportMode: string
  latitude: number
  longitude: number
  duration: string
  token: string
  callback: (data: any) => void
}

export async function getIsochroneService(request: GetIsochroneRequest) {
  // const query = await fetch(
  //   `${urlBase}${request.transportMode}/${request.longitude},${request.latitude}?contours_minutes=${request.duration}&polygons=true&access_token=${request.token}`,
  //   { method: 'GET' }
  // );
  // const data = await query.json();
  // request.callback(data);
}