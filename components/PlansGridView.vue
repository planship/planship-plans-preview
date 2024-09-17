<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { usePlanshipStore } from '@/stores/planship'

const planshipStore = usePlanshipStore()

const { currentPlanSlug, plans, levers } = storeToRefs(planshipStore)
</script>

<template>
  <div class="p-4 md:px-16">
    <div class="flex flex-col">
      <div class="flex flex-row">
        <div class="flex-none w-64" />
        <div class="flex flex-row flex-1 divide-x border-t border-r border-l rounded-t-lg bg-white">
          <template
            v-for="plan in plans"
            :key="plan.slug"
          >
            <div class="flex-1 text-center flex flex-col p-2">
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
                @click="$emit('changePlan', plan.slug)"
              >
                Choose plan
              </button>
            </div>
          </template>
        </div>
      </div>
      <div class="divide-y border bg-white">
        <template
          v-for="(lever, leverIndex) in levers"
          :key="lever.slug"
        >
          <div class="flex flex-row">
            <div class="flex-none w-64 p-2 border-r ">
              <p class="font-medium">
                {{ lever.name }}
              </p>
            </div>
            <div class="flex flex-row flex-1 divide-x">
              <template
                v-for="plan in plans"
                :key="plan.slug"
              >
                <div class="flex-1 text-center p-2 text-gray-500">
                  {{ plan.entitlements[leverIndex].formattedValue }}
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
