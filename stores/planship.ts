import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/user'

export const usePlanshipStore = defineStore('planship', () => {
  const subscriptions = ref([])
  const entitlements = ref({})
  const levers = ref([])
  const plans = ref([])
  const currentUser = ref({})
  const productSlug = ref('')

  const userStore = useUserStore()

  const defaultSubscription = computed(() => subscriptions.value?.[0])

  const currentPlanSlug = computed(() => {
    return defaultSubscription.value?.plan.slug
  })

  const currentPlanName = computed(() => defaultSubscription.value?.plan.name)

  async function fetchCurrentUser(force: boolean = false) {
    if (!force && currentUser.value?.id)
      return

    try {
      let user
      const planship = usePlanship(productSlug.value)
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
      }
      currentUser.value = user
    }
    catch (error) {
      // Handle Plaship API errors here
      console.dir(error.response)
    }
  }

  async function fetchEntitlements(force: boolean = false) {
    if (!force && Object.keys(entitlements.value).length)
      return

    try {
      const planship = usePlanship(productSlug.value)
      const newEntitlements = await planship.getEntitlements(userStore.currentUser.email)
      if (entitlements)
        entitlements.value = newEntitlements
    }
    catch (error) {
      console.dir(error.response)
    }
  }

  async function fetchSubscriptions(force: boolean = false) {
    if (!force && subscriptions.value?.length)
      return

    if (currentUser.value) {
      try {
        const planship = usePlanship(productSlug.value)
        subscriptions.value = await planship.listSubscriptions(currentUser.value.id, productSlug.value)
      }
      catch (error) {
        console.dir(error.response)
      }
    }
  }

  async function fetchPlans(force: boolean = false) {
    if (!force && plans.value?.length)
      return

    const planship = usePlanship(productSlug.value)
    const planList = await planship.listPlans()
    plans.value = await Promise.all(planList.map(async ({ slug }) => {
      return await planship.getPlan(slug, 'lever_name')
    }))
  }

  async function fetchLevers(force: boolean = false) {
    if (!force && levers.value?.length)
      return

    const planship = usePlanship(productSlug.value)
    const leverList = await planship.listLevers('name')
    levers.value = leverList
  }

  async function fetchAll(slug: string, force: boolean = false) {
    if (productSlug.value !== slug)
      force = true

    productSlug.value = slug
    return fetchCurrentUser().then(async () => {
      await Promise.all([
        fetchEntitlements(true),
        fetchSubscriptions(force),
        fetchPlans(force),
        fetchLevers(force),
      ])

      if (!defaultSubscription.value) {
        const defaultPlan = plans.value?.[0]
        if (defaultPlan) {
          await modifySubscription(defaultPlan.slug)
        }
      }
    })
  }

  async function modifySubscription(newPlanSlug: string) {
    const planship = usePlanship(productSlug.value)
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
    productSlug,

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
