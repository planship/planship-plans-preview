<script setup>
definePageMeta({
  layout: 'product'
})
import { usePlanshipStore } from '@/stores/planship'

const planshipStore = usePlanshipStore()

const { entitlements, currentPlanName } = storeToRefs(planshipStore)

</script>

<template>
  <div class="px-4">
    <h1 class="font-bold text-xl my-2">
      Customer entitlements for {{ currentPlanName }} plan
    </h1>
    <pre>{{ entitlements }}</pre>
  </div>
</template>
