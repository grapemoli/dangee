<!-- JavaScript -->
<script setup>
import { useRouter } from 'vue-router';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useStore } from 'vuex';
import { ref } from 'vue';

const store = useStore();
const confirm = useConfirm();
const toast = useToast();
const router = useRouter();

const spinnerDisplay = ref('display: none;');
const disabled = ref(false);

// Logout event handler. Removes the global API of the global address, and set the cached data to null.
// Below are the popup dialogs & event handler upon clicking logout.
const cancel = () => {
  router.push({path: '/'});
};

const logout = () => {
  // First, confirm that the user wants to logout.
  confirm.require({
    group: 'headless',
    message: 'Do you want to logout?',
    header: 'Confirmation',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Logout',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Logged out!', life: 3000 });

      // Then, logout by removing the cached data. The store does this for us.
      store.dispatch('logout');

      // UI enhancement: disable the buttons, and show a spinner.
      disabled.value = true;
      spinnerDisplay.value = 'display: block';

      setTimeout(() => {
        router.push({path: '/'});
      }, 2000)
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You are still logged in.', life: 3000 });

      // UI enhancement: disable the buttons, and show a spinner.
      disabled.value = true;
      spinnerDisplay.value = 'display: block';

      setTimeout(() => {
        router.push({path: '/'});
      }, 1000)
    }
  });
};
</script>


<!-- HTML -->
<template>
  <!-- Logout Dialog if the logout button is clicked. -->
  <Toast />

  <ConfirmDialog group="headless">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-column align-items-center p-5 surface-overlay border-round">
        <div class="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
          <i class="pi pi-question text-5xl"></i>
        </div>
        <span class="font-bold text-2xl block mb-2 mt-4">{{ message.header }}</span>
        <p class="mb-0">{{ message.message }}</p>
        <div class="flex align-items-center gap-2 mt-4">
          <Button label="Logout" @click="acceptCallback"></Button>
          <Button label="Cancel" outlined @click="rejectCallback"></Button>
        </div>
      </div>
    </template>
  </ConfirmDialog>


  <div class="card flex flex-wrap gap-2 justify-content-center">
    <Button @click="logout" label="Logout" severity="danger" outlined :disabled="disabled"></Button>
    <Button @click="cancel" label="Cancel" outlined :disabled="disabled"></Button>
  </div>

  <div class="spinner" :style="spinnerDisplay">
    <ProgressSpinner />
  </div>
</template>


<!-- CSS -->
<style>
.spinner {
  text-align: center;
  padding-top: 25vh;
}

.card {
  padding-top: 5vh;
  text-align: center;

  Button {
    margin: 10px;
  }
}
</style>