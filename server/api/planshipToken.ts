import type { TokenResponse } from '@planship/fetch'
import usePlanship from '~/composables/usePlanship.ts'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const planship = usePlanship(query.productSlug)
  return planship.getAccessToken().then((tokenData: TokenResponse) => tokenData.accessToken)
})
