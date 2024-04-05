<!-- JavaScript -->
<script setup>
import { RouterView } from 'vue-router';
import TopBanner from './components/TopBanner.vue';
import {useToast} from "primevue/usetoast";
import { useStore } from 'vuex';

const store = useStore();
const toast = useToast();


// This facilitates the user switching accounts, and updates the store accordingly.
// Check that the browser is Web3 (MetaMask) & the user is logged in.
if (window.ethereum && window.localStorage.getItem("userWalletAddress")) {
  window.ethereum.on('accountsChanged', function (selectedAccount) {
    store.dispatch('login', selectedAccount[0])
        .then(() => {
          toast.add({ severity: 'success', summary: 'Switched Accounts', detail: 'Successfully to a registered accounts.', life: 3000 });
        }).catch(() => {
          toast.add({ severity: 'error', summary: 'Error', detail: 'Could not switch accounts. Login again.', life: 3000 });
          store.dispatch('logout');
        });
  });
}
</script>

<!-- HTML -->
<template>
  <header>
    <TopBanner></TopBanner>
  </header>

  <main>
    <!-- Toast for general issues. -->
    <Toast />

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
