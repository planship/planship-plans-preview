import { defineStore, skipHydrate } from 'pinia'
import { useUserStore } from '@/stores/user'

export const usePlanshipStore = defineStore('planship', () => {
  const subscriptions = ref([])
  const entitlements = ref({})
  const levers = ref([])
  const plans = ref([])
  const currentUser = ref({})
  let productSlug = ''

  const userStore = useUserStore()

  const defaultSubscription = computed(() => subscriptions.value?.[0])


  const currentPlanSlug = computed(() => {
    return defaultSubscription.value?.plan.slug
  })

  const currentPlanName = computed(() => defaultSubscription.value?.plan.name)

  function updateEntitlementsCb(newEntitlements) {
    entitlements.value = newEntitlements
  }

  async function fetchCurrentUser(force: boolean = false) {
    if (!force && currentUser.value?.id) {
      return
    }
    try {
      let user
      const planship = usePlanship(productSlug)
      try {
        user = await planship.getCustomer(userStore.currentUser.email)
      }
      catch (error) {
        console.dir(error)
        // If the API response error is different from 404 (customer not found), rethrow it
        if (error.response.status !== 404)
          throw error
      }

      if (!user) {
        // Register customer if they don't exist in Planship
        const user = await planship.createCustomer({ alternativeId: userStore.currentUser.email })
        await planship.createSubscription(user.id, 'personal')
      }
      currentUser.value = user
      console.dir(user)
    }
    catch (error) {
      // Handle Plaship API errors here
      console.dir(error.response)
    }
  }

  async function fetchEntitlements(force: boolean = false) {
    if (!force && Object.keys(entitlements.value).length) {
      return
    }

    try {
      const planship = usePlanship(productSlug)
      const newEntitlements = await planship.getEntitlements(userStore.currentUser.email, updateEntitlementsCb)
      if (entitlements)
        entitlements.value = newEntitlements
    }
    catch (error) {
      console.dir(error.response)
    }
  }

  async function fetchSubscriptions(force: boolean = false) {
    if (!force && subscriptions.value?.length) {
      return
    }

    if (currentUser.value) {
      try {
        const planship = usePlanship(productSlug)
        subscriptions.value = await planship.listSubscriptions(currentUser.value.id, productSlug)
      }
      catch (error) {
        console.dir(error.response)
      }
    }
  }

  async function fetchPlans(force: boolean = false) {
    if (!force && plans.value?.length) {
      return
    }
    const planship = usePlanship(productSlug)
    const planList = await planship.listPlans()
    plans.value = await Promise.all(planList.map(async ({ slug }) => {
      const plan = await planship.getPlan(slug)
      plan.entitlements.sort((a, b) => (a.order - b.order))
      return plan
    }))
  }

  async function fetchLevers(force: boolean = false) {
    if (!force && levers.value?.length) {
      return
    }
    const planship = usePlanship(productSlug)
    const leverList = await planship.listLevers()
    levers.value = leverList
  }

  async function fetchAll(slug: string, force: boolean = false) {
    productSlug = slug
    return fetchCurrentUser().then(async () => {
      await Promise.all([
        fetchEntitlements(true),
        fetchSubscriptions(force),
        fetchPlans(force),
        fetchLevers(force),
      ])
    })
  }

  async function modifySubscription(newPlanSlug: string) {
    const planship = usePlanship(productSlug)
    if (defaultSubscription.value?.subscriptionId) {
      await planship.modifySubscription(userStore.currentUser.email, defaultSubscription.value.subscriptionId, {
        planSlug: newPlanSlug,
        renewPlanSlug:
          newPlanSlug,
      })
    }
    else {
      await planship.createSubscription(userStore.currentUser.email, newPlanSlug)
    }

    await Promise.all([fetchSubscriptions(true), fetchEntitlements(true)])
  }



  return {
    // state
    subscriptions,
    entitlements,
    plans,
    currentUser,
    levers,

    // getters
    defaultSubscription,
    currentPlanSlug,
    currentPlanName,

    // actions
    fetchAll,
    fetchEntitlements,
    fetchSubscriptions,
    fetchPlans,
    modifySubscription,
  }
})
