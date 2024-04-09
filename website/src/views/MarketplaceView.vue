<!-- JavaScript -->
<script setup>
import {onBeforeMount, ref} from "vue";
import { useStore } from 'vuex';
import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm";
import {useRouter} from "vue-router";

const store = useStore();
const router = useRouter();
const layout = ref('grid');
const contract = store.getters['contract'];
const toast = useToast();
const confirm = useConfirm();

// For skeleton
const skeletonStyle = ref('');
const dataStyle = ref('display:none;');
const skeletonList = ref({name: 'foo'});

// For step
const activeStep = ref(0);
const acceptCallbackButton = ref('display:none;')
const stepYesButton = ref('');
const stepItems = ref([
  {
    label: 'Review'
  },
  {
    label: 'Purchase'
  },
]);

// For dataview display
const sortKey = ref();
const sortOrder = ref();
const sortField = ref();
const sortOptions = ref([
  {label: 'ITM# High to Low', value: '!tokenId'},
  {label: 'ITM# Low to High', value: 'tokenId'},
  {label: 'Price High to Low', value: '!price'},
  {label: 'Price Low to High', value: 'price'},
]);

const NFTList = ref([
]);

const tabMenuItems = ref([
  {
    label: 'NFT Marketplace',
    icon: 'pi pi-chart-bar',
    route: '/marketplace'
  },
  {
    label: 'Library',
    icon: 'pi pi-shop',
    route: '/marketplace'
  },
  {
    label: 'Sell',
    icon: 'pi pi-bitcoin',
    route: '/marketplace',
  },
  {
  label: 'Mint',
    icon: 'pi pi-images',
    route: '/mint',
  }
]);


// Get the NFTs from the smart contract.
onBeforeMount(() => {
  contract.methods.totalItems().call().then(async (total) => {
    // Token URI's start from 0 to (total-1). Knowing this, we can get the URI (an IPFS hash)
    // for each NFT.
    for(var i = 0; i < total; i++) {
      const IPFSHash = await contract.methods.getURI(i).call();

      var newNFT = {
        URI: IPFSHash,
        URL: `${import.meta.env.VITE_GATEWAY_PRE}${IPFSHash}${import.meta.env.VITE_GATEWAY_POST}`,
        owner: (await contract.methods.getSeller(i).call()).toLowerCase(),
        selling: await contract.methods.isSelling(i).call(),
        tokenId: i,
        price: Number(await contract.methods.getPrice(i).call())        // Price in Wei. Divide by 10^-18 to get MATIC/Gwei.
      };


      NFTList.value.push(newNFT);
    }

    // If all the NFTs are loaded, then the skeleton can be removed.
    skeletonStyle.value = 'display:none;';
    dataStyle.value = 'display:block;';
  })
});

// For floating menu button.
const floatingItems = ref([
    {
      label: 'Mint ITM',
      icon: 'pi pi-pencil',
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

// Set up event listener for the smart contract. The events we listen to are:
// (1) NewItem @returnValues=(address sender, uint256 tokenId, uint256 price);
// (2) PriceUpdate @returnValues=(address owner, uint256 indexed tokenId, uint256 oldPrice, uint256 newPrice);
// (3) ItemForSale @returnValues=(address seller, uint256 indexed tokenId, uint256 price);
// (4) ItemSold @returnValues=(address seller, address buyer, uint256 indexed tokenId, uint256 price);
// Note that toast dialogs are delegated to the TopBanner component, which persists in all routes.
// This event handler only updates the NFTList information, pertaining to this route.
const websocket = store.getters['websocket'];

websocket.events.NewItem()
    .on("connected", function(subscriptionId){ console.log(`NewItem SubscriptionID=${subscriptionId}`); })
    .on("data", function(event) {

      // Append item to the NFTList.
      const tokenId = event.returnValues.tokenId;
      contract.methods.getURI(tokenId).call().then(async (IPFSHash) => {
        var newNFT = {
          URI: IPFSHash,
          URL: `${import.meta.env.VITE_GATEWAY_PRE}${IPFSHash}${import.meta.env.VITE_GATEWAY_POST}`,
          owner: event.returnValues.sender,
          selling: await contract.methods.isSelling(tokenId).call(),
          tokenId: i,
          price: event.returnValues.price                   // Price in Wei.
        };
        NFTList.value.push(newNFT);
      })
});

websocket.events.PriceUpdate()
    .on("connected", function(subscriptionId){ console.log(`PriceUpdate SubscriptionID=${subscriptionId}`);})
    .on("data", function(event) {

      // Update item in the NFTList.
      const tokenId = event.returnValues.tokenId;
      NFTList.value[tokenId].price = event.returnValues.newPrice;
     });

websocket.events.ItemForSale()
    .on("connected", function(subscriptionId){ console.log(`ItemForSale SubscriptionID=${subscriptionId}`);})
    .on("data", function(event) {

      // Update selling status in the NFTList.
      const tokenId = event.returnValues.tokenId;
      NFTList.value[tokenId].selling = true;
      NFTList.value[tokenId].price = event.returnValues.price;
    });

websocket.events.ItemSold()
    .on("connected", function(subscriptionId){ console.log(`ItemSold SubscriptionID=${subscriptionId}`);})
    .on("data", function(event) {

      // Update the owner in the NFTList.
      const tokenId = event.returnValues.tokenId;
      NFTList.value[tokenId].owner = event.returnValues.buyer.toLowerCase();

    });


// Gets how we should display the tag for each NFT.
const getSeverity = (NFT) => {
  switch (NFT.selling) {
    case true:
      // There are two cases of true: (1) the user owns the NFT, or (2) the owner does not own the NFT.
      // Check which case this is.
      return (NFT.owner === store.getters['userId'] ? 'contrast' : 'success');
    case false:
      return 'danger';
    default:
      return 'danger';
  }
}

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

// Buy NFT Button Event Handler
function buyNFT(NFT) {
  // Only users who are on a Web3 browser and/or signed in can purchase NFTs.
  if (window.ethereum && window.ethereum.isMetaMask) {

    // Check that the user is logged in.
    if (!!!store.getters['userId']) {

      // Logged out. Need to be logged in to continue.
      toast.add({ severity: 'error', summary: 'Error', detail: 'Please login to buy an ITM.', life: 5000 });

    }
    else {

      // Valid user! We assume that other components successfully checked that this NFT is
      // being sold by the owner, and its price is >0 MATIC, etc.
      // 1. Show a popup that asks the user if the information is correct. Then, confirm that
      // the user wishes to purchase this NFT.
      store.dispatch('updateBalance');

      contract.methods.buy(NFT.tokenId).estimateGas(
          {
            from: store.getters['userId'],
            value: NFT.price
          }
      ).then(async (gas) => {

        await store.dispatch('updateGasFee');

        confirm.require({
          group: 'headless',
          message: `Is this information correct?`,
          buyer: store.getters['userId'],
          price: NFT.price,
          gasEstimate: gas,
          balance: store.getters['balance'],
          tokenId: NFT.tokenId,
          header: 'Confirmation',
          icon: 'pi pi-info-circle',
          rejectLabel: 'No',
          acceptLabel: 'Yes',
          rejectClass: 'p-button-secondary p-button-outlined',
          acceptClass: 'p-button-danger',
          accept: () => {
            // 2. Call on the smart contract to purchase this NFT. Then, confirm that this
            // NFT was bought via a toaster. Update the NFTList and store. Finally, listen to the
            // event emitted by the smart contract.
            store.dispatch('updateBalance');

            // Note that we divide by 10^-18 because the price is in Wei. 10^18 Wei = 1 GWei = 1 MATIC.
            // Total cost = (NFTCostWei) + (GasCostWei) = (NFTCostWei) + (Gas + GasPriceGWei * Wei/GWei)
            const transactionValue = (NFT.price) + (gas * store.getters['gasFee'].FastGasPrice * 1000000000);

            if ((NFT.price * 0.000000000000000001) > store.getters['balance']) {
              // While the gas fees are estimated, the cost of the NFT is a lower threshold;
              // the user 100% does not have enough MATIC to fund this transaction.
              toast.add({ severity: 'error', summary: 'Error', detail: 'Not enough MATIC to purchase.', life: 5000 });
            }
            else {

              // Call the contract method.
              contract.methods.buy(NFT.tokenId).send({from: store.getters['userId'], value: transactionValue.toString()})
                  .catch((err) => {

                    // Inform the user that something went wrong.
                    // Clean the JSON Object since the MetaMask JSON-RPC Object starts with an extraneous string on
                    // top of the JSON object.
                    console.log(err)

                    if (err.code === 4001) {
                      err.message = err.message.replace('MetaMask Tx Signature: ', '');
                    }
                    else if (err.toString.indexOf('Transaction was not mined within 50 blocks') > -1) {
                      err = {message: 'This purchase may take awhile.'};
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
                  });

              activeStep.value = 0;
              stepYesButton.value = '';
              acceptCallbackButton.value = 'display:none;';
            }

          },
          reject: () => {
            activeStep.value = 0;
            stepYesButton.value = '';
            acceptCallbackButton.value = 'display:none;';
          }
        });
      }).catch((err) => toast.add({ severity: 'error', summary: 'Error', detail: `${err.toString().replace('Error: ', '')}`, life: 5000 }))
    }
  }
  else {

    // The user needs a Web3 browser.
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please install MetaMask to buy an ITM', life: 5000 });

  }
}

function stepYes() {
  // Goes through the active steps.
  activeStep.value = activeStep.value + 1;

  if (activeStep.value > 0) {
    stepYesButton.value = 'display:none;';
    acceptCallbackButton.value = '';
  }
}

function reload() {
  // Reload the window.
  window.location.reload();
}
</script>


<!-- HTML -->
<template>
  <!-- Error Messages for Buying, and Buying Dialog. -->
  <Toast></Toast>

  <ConfirmDialog group="headless" style="width: 75%; height: 100%;">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-column align-items-center p-5 surface-overlay border-round">

        <span class="font-bold text-2xl block mb-2 mt-4">{{ message.header }}</span>

        <div class="card" style="width:100%;">
          <Steps :model="stepItems" v-model:activeStep="activeStep" />

          <!-- Step One: Confirm Information -->
          <div v-if="(activeStep === 0)" style="margin-top: 5%; text-align: left; margin-left: 10%; margin-right: 10%; overflow: hidden; overflow-x: scroll; text-overflow: ellipsis; white-space: nowrap;">

            <span class="font-bold text-xl block mb-2 mt-4">ITM #{{ message.tokenId }}</span>
            <span class="font-bold text-xl block mb-2 mt-4">Price: <span class="font-normal"> {{message.price * 0.000000000000000001}} MATIC</span></span>

            <span class="font-bold text-xl block mb-2 mt-4">Slow Gas Fee (estimate): <span class="font-normal"> {{message.gasEstimate * store.getters['gasFee'].SafeGasPrice * 0.000000001}} MATIC</span></span>
            <span class="font-bold text-xl block mb-2 mt-4">Fast Gas Fee (estimate): <span class="font-normal"> {{message.gasEstimate * store.getters['gasFee'].FastGasPrice * 0.000000001}} MATIC</span></span>

            <span class="font-bold text-xl block mb-2 mt-4">Buyer: <span class="font-normal"> {{message.buyer}} </span></span>


            <Divider></Divider>

            <span class="text-xl block mb-2 mt-4" style="padding-top:3%; text-align:center;">Is this information correct?</span>

          </div>

          <!-- Step Two: Confirm Purchase -->
          <div v-else style="margin-top: 5%; text-align: center; margin-left: 10%; margin-right: 10%; overflow: hidden; overflow-x: scroll; text-overflow: ellipsis; white-space: nowrap;">
            <span class="text-xl block mb-2 mt-4" style="padding-top: 5%;">Buy this ITM?</span>
            <span class="text-l block mb-2 mt-4" style="padding-bottom:12.5%;"><span class="pi pi-exclamation-triangle"></span>&nbsp; Note: This process is irreversible.</span>
          </div>
        </div>

        <div class="flex align-items-center gap-2" style="margin-top:20px;">
          <Button label="Yes" @click="stepYes()" :style="stepYesButton"></Button>
          <Button label="Yes" @click="acceptCallback" :style="acceptCallbackButton"></Button>
          <Button label="No" outlined @click="rejectCallback"></Button>
        </div>

      </div>
    </template>
  </ConfirmDialog>


  <h1 class="title">Marketplace</h1>

  <!-- DataView -->
  <div class="card" :style="dataStyle" v-cloak>
    <DataView :value="NFTList" :layout="layout" :sortOrder="sortOrder" :sortField="sortField" paginator :rows="20">
      <template #header>
        <table style="width:100%;">
          <colgroup>
            <col span="1" style="width: 75%;">
            <col span="1" style="width: 25%;">
          </colgroup>

          <tbody>
            <tr>
              <th>
                <Dropdown class='sort-dropdown' v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="ITM# High to Low" @change="onSortChange($event)" />
              </th>
              <th style="text-align:right;">
                <DataViewLayoutOptions class="custom-data-view view-options" v-model="layout" />
              </th>
            </tr>
          </tbody>
        </table>

        <!-- Floating button menu -->
        <SpeedDial :model="floatingItems" class="right-0 bottom-0" :tooltipOptions="{ position: 'left' }" style="position:fixed; margin:2%;" />

      </template>

      <!-- Actual DataView: List View -->
      <template #list="slotProps" class="font-overflow" :display="displayGrid">
        <div class="grid grid-nogutter font-overflow">
          <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
            <div class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3" :class="{ 'border-top-1 surface-border': index !== 0 }">
              <div class="md:w-10rem relative">
                <Image class='nft-img' imageClass="nft-img block xl:block mx-auto border-round w-full" :id="item.URI" :src="item.URL" :alt="item.URI" preview></Image>
                <Tag :value="getSeverity(item) === 'contrast' ? 'OWNED' : (getSeverity(item) === 'success' ? 'SELLING' : 'NOTFORSALE')" :severity="getSeverity(item)" class="absolute" style="left: 4px; top: 4px"></Tag>
              </div>
              <div class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-4">
                <div class="flex flex-row md:flex-column justify-content-between align-items-start gap-2">
                  <div>
                    <span class="font-medium text-secondary text-sm" style="padding:5%;">ITM #{{ item.tokenId }}</span>
                  </div>
                  <div class="surface-100 p-1" style="border-radius: 30px">
                    <div class="surface-0 flex align-items-center gap-2 justify-content-center py-1 px-2" style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)">
                      <span class="font-overflow text-900 font-medium text-sm" v-text="item.owner"></span>
                      <i class="pi pi-user text-purple-500"></i>
                    </div>
                  </div>
                </div>
                <div class="flex flex-column md:align-items-end gap-5">
                  <span class="text-xl font-semibold text-900" v-text="`${item.price * 0.000000000000000001} MATIC`"></span>
                  <div class="flex flex-row-reverse md:flex-row gap-2">
                    <Button icon="pi pi-shopping-cart" label="Buy Now" @click="buyNFT(item)" :disabled="!item.selling ? true : (item.owner === store.getters['userId'])" class="flex-auto md:flex-initial white-space-nowrap"></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Actual Dataview: Grid View -->
      <template #grid="slotProps" :display="displayGrid">
        <div class="grid grid-nogutter">
          <div v-for="(item, index) in slotProps.items" :key="index" class="col-12 sm:col-6 md:col-4 xl:col-6 p-2">
            <div class="p-4 border-1 surface-border surface-card border-round flex flex-column">
              <div class="surface-50 flex justify-content-center border-round p-3">
                <div class="relative mx-auto">
                  <Image class='nft-img' imageClass="nft-img border-round w-full" :id="item.URI" :src="item.URL" :alt="item.URI" style="max-width: 300px" preview></Image>
                  <Tag :value="getSeverity(item) === 'contrast' ? 'OWNED' : (getSeverity(item) === 'success' ? 'SELLING' : 'NOTFORSALE')" :severity="getSeverity(item)" class="absolute" style="left: 4px; top: 4px"></Tag>
                </div>
              </div>
              <div class="pt-4 font-overflow">
                <div class="flex flex-row justify-content-between align-items-start gap-2">
                  <div>
                    <span class="font-overflow font-medium text-secondary text-sm">ITM #{{ item.tokenId }}</span>
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
                    <Button icon="pi pi-shopping-cart" label="Buy Now" @click="buyNFT(item)" :disabled="!item.selling ? true : (item.owner === store.getters['userId'])" class="flex-auto md:flex-initial white-space-nowrap"></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating button menu -->
        <SpeedDial :model="floatingItems" class="right-0 bottom-0" :tooltipOptions="{ position: 'left' }" style="position:fixed; margin:2%;" />
      </template>
    </DataView>
  </div>



  <!-- Skeleton: for loading. -->
  <DataView class="card" :value="skeletonList" :layout="layout" paginator :rows="20" :style="skeletonStyle">
    <template #header>
      <table style="width:100%;">
        <colgroup>
          <col span="1" style="width: 75%;">
          <col span="1" style="width: 25%;">
        </colgroup>

        <tbody>
        <tr>
          <th>
            <Dropdown class='sort-dropdown' v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="ITM# High to Low" @change="onSortChange($event)" />
          </th>
          <th style="text-align:right;">
            <DataViewLayoutOptions class="custom-data-view view-options" v-model="layout" />
          </th>
        </tr>
        </tbody>
      </table>
    </template>

    <!-- Skeleton for loading: List View -->
    <template #list>
      <div class="grid grid-nogutter">
        <div v-for="i in 6" :key="i" class="col-12">
          <div class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3" :class="{ 'border-top-1 surface-border': i !== 0 }">
            <Skeleton class="w-9 sm:w-16rem xl:w-10rem h-6rem block xl:block mx-auto border-round" style="text-align:left;"/>
            <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
              <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                <Skeleton class="w-6rem border-round h-1rem" style="margin-top:10%;"/>
                <div class="flex align-items-center gap-3">
                  <Skeleton class="w-12rem border-round h-1rem" />
                </div>
              </div>
              <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                <Skeleton class="w-4rem border-round h-2rem" />
                <Skeleton class="w-6rem border-round h-2rem" style="margin-top:50%;"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Skeleton for loading: Grid View -->
    <template #grid>
      <div class="grid grid-nogutter" style="margin:2.8%;">
        <div v-for="i in 6" :key="i" class="col-12 sm:col-6 md:col-4 xl:col-6 p-2">
          <div class="p-4 border-1 surface-border surface-card border-round">
            <div class="flex flex-column align-items-center gap-3 py-5">

              <Skeleton class="border-round" style="width: 100%; height: 300px;"/>

              <table style="width:100%;">
                <colgroup>
                  <col span="1" style="width: 75%;">
                  <col span="1" style="width: 25%;">
                </colgroup>

                <tbody>
                <tr>
                  <th>
                    <Skeleton class="w-4rem border-round h-1rem" />
                  </th>
                  <th style="text-align:right;">
                    <Skeleton class="w-10rem border-round h-1rem" />
                  </th>
                </tr>
                </tbody>
              </table>

              <Skeleton class="w-8rem border-round h-2rem" style="margin-top:10%;"/>
              <Skeleton class=" border-round h-2rem" style="width:100%; margin-top:5%; margin-bottom: 1%;"/>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DataView>

</template>


<!-- CSS -->
<style>
[v-cloak] {
  display:none;
}

.card {
  margin-top: 0px;
}

.title {
  text-align: center;
  margin-top: 4%;
  margin-bottom: 0px;
  font-family: "Bebas Neue", sans-serif;
  font-size: 10vh;
  font-weight: 400;
  font-style: normal;
}

.tab-menu {
  margin-top: 5vh;
}

.p-dataview-header {
  display: inline-flex;
  width: 100%;

  .sort-dropdown {
    align-items: center;
  }

  .view-options {
    align-items: center;
  }
}


.nft-img {
  height: 300px;
}

.font-overflow {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>