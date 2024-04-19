<script setup lang="ts">

// Only include analytics in prod
if (process.env.NODE_ENV !== 'development') {
  useHead({
    script: [{
      async: '',
      src: 'https://metrics.planship.io/script.js',
      'data-website-id': '295a66cd-9044-4200-a41c-635d0fca5f3e'
    }]
  })
}

</script>

<template>
  <div class="flex flex-col overflow-hidden h-[calc(100dvh)] bg-slate-50">
    <ProductNavBar />
    <div class="flex-grow overflow-y-scroll">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>
