import { ErrorType } from '../lib/model/ErrorType.ts';
import { tokenValidation } from '../lib/service/tokenValidation.ts';
import { token } from '../lib/shared/stores/token.ts';

export const actions = {
  saveToken: async ({ request }) => {
    const formData = await request.formData()
    const apiKey = String(formData.get('api-key'))
    token.set(apiKey)
    let errorResult: ErrorType | null = await tokenValidation(apiKey)
    if (errorResult === null) {
      return { errorType: null }
    } else {
      return { errorType: errorResult }
    }
  }
  // @ts-ignore
}