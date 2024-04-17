<script setup>
import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { usePlanshipStore } from '@/stores/planship'

const route = useRoute()

const planshipStore = usePlanshipStore()
await planshipStore.fetchAll(route.params.slug)

</script>

<template>
  <Disclosure as="nav" class="bg-gray-800 text-gray-300">
    <div class="mx-auto max-w-full px-4">
      <div class="flex items-start md:items-center justify-between py-3">
        <div class="grow flex flex-col md:flex-row">
          <div class="flex items-center flex-row">
            <NuxtLink
              class="block nav-link"
              :class="route.name === 'slug' ? 'bg-gray-700' : ''"
              :to="`/${route.params.slug}`"
            >
              Plans
            </NuxtLink>
            <NuxtLink
              class="block nav-link"
              :class="route.name === 'slug-entitlements' ? 'bg-gray-700' : ''"
              :to="`/${route.params.slug}/entitlements`"
            >
              Entitlements
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </Disclosure>
</template>

<style lang="postcss">
.nav-caption {
  @apply text-gray-400 rounded-md px-2 text-sm font-light;
}

.nav-link {
  @apply border border-gray-500 md:border-none text-gray-300 hover:bg-gray-600 hover:text-white rounded-md mx-1 px-2 py-1 text-sm font-medium;
}

.user-btn {
  @apply flex max-w-xs items-center rounded-full bg-gray-800 text-sm hover:outline-none hover:ring-1 hover:ring-gray-400 hover:ring-offset-2 hover:ring-offset-gray-800;
}
</style>
