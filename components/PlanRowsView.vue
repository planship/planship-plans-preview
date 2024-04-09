<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import {
  RadioGroup,
  RadioGroupDescription,
  RadioGroupLabel,
  RadioGroupOption,
} from '@headlessui/vue'
import { usePlanshipStore } from '@/stores/planship'

const planshipStore = usePlanshipStore()

const { modifySubscription } = planshipStore

const { currentPlanSlug, plans, levers } = storeToRefs(planshipStore)
const planSelection = ref(planshipStore.currentPlanSlug)

</script>

<template>
  <div class="p-4 md:px-16">
    <div class="flex flex-col">
      <div class="flex flex-row">
        <div class="flex-none w-64 border-r" />
        <template
          v-for="plan in plans"
          :key="plan.slug"
          :value="plan.slug"
        >
          <div class="flex-1 text-center block flex flex-col border-t border-r p-2">
            <p
              class="text-2xl font-semibold"
            >
              {{ plan.name }}
            </p>
            <p class="font-light m-2 flex-grow">
              {{ plan.description }}
            </p>
            <button
              class="align-bottom inline-block rounded-md px-5 py-2 text-base text-white m-3"
              :disabled="currentPlanSlug === plan.slug"
              :class="currentPlanSlug !== plan.slug ? 'bg-green-500 hover:bg-opacity-90' : 'bg-gray-400'"
              @click="modifySubscription(plan.slug)"
            >
              Choose plan
            </button>
          </div>
        </template>
      </div>
      <div class="border-t">
        <template
          v-for="(lever, leverIndex) in levers"
          :key="lever.slug"
          :value="lever.slug"
        >
          <div class="flex flex-row border-b">
            <div class="flex-none w-64 p-2 border-r border-l">
              <p class="font-medium">{{ lever.name }}</p>
            </div>
            <template
              v-for="plan in plans"
              :key="plan.slug"
              :value="plan.slug"
            >
              <div class="flex-1 text-center border-r p-2 font-light">{{ plan.entitlements[leverIndex].formattedValue }} </div>
            </template>
          </div>
        </template>
      </div>
    </div>
<!--
    <div class="flex flex-col md:flex-row justify-between gap-6">
      <template
        v-for="plan in plans"
        :key="plan.slug"
        :value="plan.slug"
      >
        <div
          class="md:flex-1 md:flex-grow w-full p-4 rounded-lg mx-auto text-center shadow-md focus:outline-none"
        >
          <p
            class="text-2xl font-semibold"
          >
            {{ plan.name }}
          </p>
          <div
            class="inline"
          >
            <p class="font-light my-2">
              {{ plan.description }}
            </p>
            <ul
              v-for="entitlement in plan.entitlements"
              :key="entitlement.name"
              :value="entitlement.name"
              role="list"
              class="mb-1 text-left"
            >
              <li class="flex items-center space-x-2">
                <span><strong>{{ entitlement.leverName }}: </strong>{{ entitlement.formattedValue}}</span>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </div>
    <div class="flex mt-10 justify-end ">
      <button
        class="block md:w-64 w-full rounded-md px-10 py-3 text-base text-white font-medium"
        :class="currentPlanSlug !== planSelection ? 'bg-green-500 hover:bg-opacity-90' : 'bg-gray-400'"
        :disabled="currentPlanSlug === planSelection"
        @click="modifySubscription(planSelection)"
      >
        Change subscription
      </button>
    </div> -->
  </div>
</template>
