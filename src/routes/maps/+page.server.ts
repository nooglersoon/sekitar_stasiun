import { token } from '../../lib/shared/stores/token.ts';

export async function load() {
  let newToken = ''
  token.subscribe((token) => {
    newToken = token
  })
  return { value: newToken }
}