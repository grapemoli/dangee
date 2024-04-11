<!-- JavaScript -->
<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();

const floatingItems = ref([
  {
    label: 'Mint ITM',
    icon: 'pi pi-images',
    command: () => {
      router.push({path: '/mint'});
    }},
  {
    label: 'Refresh Page',
    icon: 'pi pi-refresh',
    command: () => {
      window.location.reload();
    }
  }
]);
</script>


<!-- HTML -->
<template>
  <!-- Floating Button Menu -->
  <SpeedDial :model="floatingItems" class="right-0 bottom-0" :tooltipOptions="{ position: 'left' }" style="position:fixed; margin:2%;" />
</template>


<!-- CSS -->
<style>
</style>