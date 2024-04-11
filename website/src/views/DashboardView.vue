<!-- JavaScript -->
<script setup>
import { ref, watch, computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex'
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";

const store = useStore();
const confirm = useConfirm();
const toast = useToast();

const contract = store.getters['contract'];
const walletId = computed(() => store.getters["userId"]);
const isAuth = computed(() => store.getters["isAuth"]);
const balance = computed(() => store.getters['balance']);
const minter = computed(() => store.getters['minter']);
const minterButtonStyle = computed(() => store.getters['minter'] !== null);

const grantMintRole = () => {
  // First, confirm that the user wants to logout.
  confirm.require({
    group: 'headless',
    message: 'Become a Minter?',
    header: 'Confirmation',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Logout',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {

      // Call the contract to make this user a minter. Then, inform the user.
      if (window.ethereum && window.ethereum.isMetaMask && isAuth.value && !minter.value) {
        contract.methods.grantMintRole(walletId.value).send({
          from: import.meta.env.VITE_WALLET_ADDRESS
        })
            .then(() => {
              store.dispatch('updateMinter');
              toast.add({severity: 'success', summary: 'Confirmed', detail: 'You are now a minter!', life: 3000});
            })
            .catch((err) => {
              console.log(err)
              toast.add({severity: 'error', summary: 'Rejected', detail: 'Your minter application was denied.', life: 3000});
            })
      }
      else if (minter.value) {
        toast.add({severity: 'info', summary: 'Info', detail: 'You are already a minter.', life: 3000});
      }
    },
    reject: () => {
      // Do nothing
    }
  });
}


watch(walletId, () => {
  // Update the user information if the walletId changes.
  if (window.ethereum && isAuth.value) {
    store.dispatch('updateBalance');
    store.dispatch('updateMinter');
  }
})

</script>


<!-- HTML -->
<template>
  <!-- Confirmation for becoming a minter -->
  <Toast/>

  <ConfirmDialog group="headless">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-column align-items-center p-5 surface-overlay border-round">

        <span class="font-bold text-2xl block mb-2 mt-4">{{ message.header }}</span>

        <span class="text-l block mb-2 mt-4">{{ message.message }}</span>
        <span class="text-l block mb-2 mt-4"><span class="pi pi-exclamation-triangle"></span>&nbsp; Note: This process is irreversible. There may also be a delay while waiting for the Admin to accept your request.</span>

        <div class="flex align-items-center gap-2" style="margin-top:20px;">
          <Button label="Yes" @click="acceptCallback"></Button>
          <Button label="No" outlined @click="rejectCallback"></Button>
        </div>

      </div>
    </template>
  </ConfirmDialog>

  <!-- Dashboard -->
  <Card class="card">
    <template #title>
      Dashboard
      <Divider/>
    </template>


    <template #content>
      <table>
        <tr>
          <th><h3>Wallet Address</h3></th>
          <th v-if="isAuth" class="data">{{ walletId }}</th>
          <th v-else class="data">Not signed in.</th>
        </tr>

        <tr>
          <th><h3>Balance (MATIC)</h3></th>
          <th v-if="isAuth" class="data" id='balance'>{{ balance }}</th>
          <th v-else class="data">Not signed in.</th>
        </tr>

        <tr>
          <th><h3>Minter </h3></th>
          <th v-if="isAuth" class="data" id='minter' v-show="minterButtonStyle">{{ minter ? 'Yes' : 'No'}}</th>
          <th v-else class="data">Not signed in.</th>

          <th v-if="!minter && isAuth"><Button v-tooltip="'This action is irreversible.'" v-cloak v-show='minterButtonStyle' label="Become a Minter Now" @click="grantMintRole()"></Button></th>
        </tr>

      </table>

    </template>
  </Card>
</template>


<!-- CSS -->
<style>
[v-cloak] {
  display: none;
}

.card {
  margin: 5vh;
  overflow-x: scroll;
}

table {
  text-align: left;

  .data {
    padding-left: 2vh;
    font-weight: normal;
  }
}

h3 {
}
</style>
