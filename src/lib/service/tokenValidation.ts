import { ErrorType } from '../../lib/model/ErrorType.ts';

export const tokenValidation = async (token: string): Promise<ErrorType | null> => {
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