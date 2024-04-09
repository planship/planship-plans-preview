<script setup lang="ts">

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
