<!-- JavaScript -->
<script setup>
import { RouterView } from 'vue-router';
import TopBanner from './components/TopBanner.vue';
</script>

<!-- HTML -->
<template>
  <header>
    <TopBanner></TopBanner>
  </header>

  <main>
    <!-- Makes sure to display the route's view. -->
    <RouterView></RouterView>
  </main>
</template>

<!-- CSS -->
<style scoped lang="scss">
body {
  background-color: var(--surface-0);
  font-family: var(--font-family);
  font-weight: 400;
  color: var(--text-color);
}
</style>
