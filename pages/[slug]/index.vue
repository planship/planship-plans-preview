<script setup>
definePageMeta({
  layout: 'product'
})

import {
  Switch,
} from '@headlessui/vue'

const gridView = ref(true)
</script>

<template>
  <div class="flex justify-end">
    <Switch
      v-model="gridView"
      :class="gridView ? 'bg-blue-600' : 'bg-gray-200'"
      class="m-2 relative inline-flex h-6 w-11 items-center rounded-full"
    >
      <span class="sr-only">Show as grid</span>
      <span
        :class="gridView ? 'translate-x-6' : 'translate-x-1'"
        class="inline-block h-4 w-4 transform rounded-full bg-white transition"
      />
    </Switch>
  </div>
  <PlanRowsView v-if="gridView" />
  <PlansView v-else/>
</template>
