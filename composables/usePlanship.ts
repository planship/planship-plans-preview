import { Planship } from '@planship/fetch'

let planshipClientsBySlug = {}

async function getAccessToken(productSlug: string) {
  return fetch(`/api/planshipToken?${new URLSearchParams({
    productSlug: productSlug,
  })}`).then(response => response.text())
}

function getPlanshipClient(productSlug: string) {
  if (!planshipClientsBySlug[productSlug]) {
    let planshipClient
    if (process.server) {
      planshipClient = new Planship(
        productSlug,
        {
          clientId: useRuntimeConfig().planshipApiClientId,
          clientSecret: useRuntimeConfig().planshipApiClientSecret,
        },
        {
          baseUrl: useRuntimeConfig().public.serverPlanshipBaseUrl
        }
      )
    } else {
      planshipClient = new Planship(
        productSlug,
        () => getAccessToken(productSlug),
        {
          baseUrl: useRuntimeConfig().public.clientPlanshipBaseUrl,
          webSocketUrl: useRuntimeConfig().public.webSocketUrl,
        }
      )
    }
    planshipClientsBySlug[productSlug] = planshipClient
  }

  return planshipClientsBySlug[productSlug]
}

export default function(productSlug: string) {
  return getPlanshipClient(productSlug)
}
