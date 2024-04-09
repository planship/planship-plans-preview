<script setup>
definePageMeta({
  layout: 'product'
})

import {
  Switch,
} from '@headlessui/vue'

import { usePlanshipStore } from '@/stores/planship'

const planshipStore = usePlanshipStore()
const route = useRoute()
const { modifySubscription } = planshipStore

function changePlan(planSlug) {
  modifySubscription(planSlug)
  navigateTo(`/${route.params.slug}/entitlements`)
}

const isGridView = ref(true)
</script>

<template>
  <div class=" justify-end hidden md:flex">
    <Switch
      v-model="isGridView"
      :class="isGridView ? 'bg-blue-600' : 'bg-gray-200'"
      class="m-2 relative inline-flex h-6 w-11 items-center rounded-full"
    >
      <span class="sr-only">Show as grid</span>
      <span
        :class="isGridView ? 'translate-x-6' : 'translate-x-1'"
        class="inline-block h-4 w-4 transform rounded-full bg-white transition"
      />
    </Switch>
  </div>
  <PlansGridView @change-plan="changePlan" class="hidden md:block" v-if="isGridView" />
  <PlansListView @change-plan="changePlan"  class="hidden md:block" v-else/>
  <PlansListView @change-plan="changePlan"  class="md:hidden" />
</template>
