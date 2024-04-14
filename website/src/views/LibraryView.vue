<!-- JavaScript -->
<script setup>
import FloatingButtonMenu from '../components/FloatingButtonMenu.vue';
import {ref, computed, watch} from "vue";
import {useStore} from 'vuex';
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";

const store = useStore();
const toast = useToast();
const router = useRouter();
const layout = ref('grid');
const contract = store.getters['contract'];

// For editing an NFT.
const price = ref();
const selling = ref();
const position = ref('center');
const visible = ref(false);
const selectedNFT = ref();

// For dataview display
const sortKey = ref();
const sortOrder = ref();
const sortField = ref();
const NFTList = computed(() => store.getters['nft']);
const sortOptions = ref([
  {label: 'ITM# High to Low', value: '!tokenId'},
  {label: 'ITM# Low to High', value: 'tokenId'},
  {label: 'Price High to Low', value: '!price'},
  {label: 'Price Low to High', value: 'price'},
]);


// Event handler for the sort drop-down.
const onSortChange = (event) => {
  const value = event.value.value;
  const sortValue = event.value;

  if (value.indexOf('!') === 0) {
    sortOrder.value = -1;
    sortField.value = value.substring(1, value.length);
    sortKey.value = sortValue;
  }
  else {
    sortOrder.value = 1;
    sortField.value = value;
    sortKey.value = sortValue;
  }
};

// Event handler for editing an NFT.
function openEdit(NFT, pos) {
  selling.value = NFT.selling;
  price.value = NFT.price * 0.000000000000000001;     // Wei to GWei/MATIC
  position.value = pos;
  visible.value = true;
  selectedNFT.value = NFT;
}

function toastErr(err) {
  // Modifies the error as needed, and then notifies the user using the the toast.

  if (err.code === 4001) {
    err.message = err.message.replace('MetaMask Tx Signature: ', '');
  }
  else {
    err = err.toString()
    if (err.indexOf('Internal JSON-RPC error.') > -1) {
      err = err.replace('\n', '').replace("Error: ", '').replace('Internal JSON-RPC error.', '')
      err = err.replace ('execution reverted: ', '');
      err = JSON.parse(err)
    }
  }

  toast.add({ severity: 'error', summary: 'Error', detail: `${err.message}`, life: 5000 });
}

function edit() {
  // If the inputted values are different, call the contract to change them.
  // Actual updates to the store are done when the contract emits the event; however.
  // because all data on this route is computed via the store, we let the upper-layer
  // event listener handle it for us.
  if(store.getters['isAuth']) {

    const newPriceWei = `${price.value * 1000000000000000000}`;
    const oldPriceWei = `${selectedNFT.value.price}`;

    if(newPriceWei !== oldPriceWei) {

      if (selling.value !== selectedNFT.value.selling) {
        // All values were changed.
        contract.methods.updateAll(selectedNFT.value.tokenId, newPriceWei, selling.value).send({from: store.getters['userId']}).catch((err) => toastErr(err));
      }
      else {
        // Only price was changed.
        contract.methods.updatePrice(selectedNFT.value.tokenId, newPriceWei).send({from: store.getters['userId']}).catch((err) => toastErr(err));
      }
    }
    else {

      if (selling.value !== selectedNFT.value.selling) {
        // Only selling was changed.
        contract.methods.setSelling(selectedNFT.value.tokenId, selling.value).send({from: store.getters['userId']}).catch((err) => toastErr(err));
      }
      else {
        // Nothing was changed.
        toast.add({ severity: 'info', summary: `Nothing Updated`, detail: `ITM #${selectedNFT.value.tokenId} remains the same.`, life: 5000 });
      }
    }
  }

  // Finally, set visible to false.
  visible.value = false;
}

watch((visible), async (currentValue, oldValue) => {
  // Reset form values if the form is closed.
  if (!currentValue) {
    price.value = 0;
    selectedNFT.value = null;
  }
})
</script>


<!-- HTML -->
<template>
  <FloatingButtonMenu></FloatingButtonMenu>
  <Toast></Toast>


  <h1 class="title">Library</h1>

  <!-- DataView -->
  <div class="card" v-cloak>
    <DataView :value="NFTList" :layout="layout" :sortOrder="sortOrder" :sortField="sortField" paginator :rows="20">
      <template #header>
        <Dropdown class='sort-dropdown' v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="ITM# High to Low" @change="onSortChange($event)" />

      </template>

      <!-- Actual Dataview: Grid View -->
      <template #grid="slotProps">
        <div class="grid grid-nogutter">
          <div v-for="(item, index) in slotProps.items" :key="index" class="col-12 sm:col-6 md:col-4 xl:col-6 p-2">
            <div class="p-4 border-1 surface-border surface-card border-round flex flex-column">
              <div class="surface-50 flex justify-content-center border-round p-3">
                <div class="relative mx-auto">
                  <Image class='nft-img' imageClass="nft-img border-round w-full" :id="item.URI" :src="item.URL" :alt="item.URI" style="max-width: 300px" preview></Image>
                </div>
              </div>
              <div class="pt-4 font-overflow">
                <div class="flex flex-row justify-content-between align-items-start gap-2">
                  <div>
                    <div class="text-lg font-medium text-900 mt-2">ITM #{{item.tokenId}}</div>
                    <Tag rounded :value="item.selling ? 'Selling' : 'Not Selling'" :severity="item.selling ? 'success' : 'primary'"></Tag>
                  </div>

                  <div class="surface-100 p-1 font-overflow" style="border-radius: 30px">
                    <div class="surface-0 flex align-items-center gap-2 justify-content-center py-1 px-2" style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)">
                      <span class="font-overflow text-900 font-medium text-sm" v-text="item.owner"></span>
                      <i class="pi pi-user text-purple-500"></i>
                    </div>
                  </div>
                </div>
                <div class="flex flex-column gap-4 mt-4">
                  <span class="font-overflow text-2xl font-semibold text-900" v-text="`${item.price * 0.000000000000000001} MATIC`"></span>
                  <div class="flex gap-2">
                    <Button icon="pi pi-pencil" label="Edit" @click="openEdit(item, `top`)" style="width:100%;" class="flex-auto md:flex-initial white-space-nowrap"></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>


  <!-- Edit an NFT button. -->
  <Dialog v-model:visible="visible" modal :header="!!!!selectedNFT ? `Edit ITM#  ${selectedNFT.tokenId}` : ``" :style="{ width: '25rem' }">
    <span class="p-text-secondary block mb-5">Update your information.</span>
    <div class="flex align-items-center gap-3 mb-3">
        <label for="price" class="font-semibold w-6rem"> Price (MATIC) </label>
        <InputNumber v-model="price" inputId="price" :min="0.000000000000000001" :minFractionDigits="0" :maxFractionDigits="18" />
    </div>
    <div class="flex align-items-center gap-3 mb-5">
      <label for="sell" class="font-semibold w-6rem">Selling</label>
      <InputSwitch v-model="selling" />

    </div>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
      <Button type="button" label="Save" @click="edit()"></Button>
    </div>
  </Dialog>


</template>


<!-- CSS -->
<style>
.title {
  text-align: center;
  margin-top: 4%;
  margin-bottom: 0px;
  font-family: "Bebas Neue", sans-serif;
  font-size: 10vh;
  font-weight: 400;
  font-style: normal;
}
</style>