<!-- JavaScript -->
<script setup>
import {onBeforeMount, ref} from "vue";
import { useStore } from 'vuex';

const store = useStore();
const layout = ref('grid');
const contract = store.getters['contract'];

const skeletonStyle = ref('');
const dataStyle = ref('display:none;');

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
    {
      URI: 'foo',
      URL: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Google_Images_2015_logo.svg',
      owner: 'foo',
      selling: true,
      tokenId: 100,
      price: 100
    },
  {
    URI: 'foo',
    URL: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Google_Images_2015_logo.svg',
    owner: 'foo',
    selling: true,
    tokenId: 50,
    price: 0
  },
]);

const items = ref([
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
    route: '/marketplace',
  }
]);

// Get the NFTs from the smart contract.
onBeforeMount(() => {
  contract.methods.totalItems().call().then(async (total) => {
    // Token URI's start from 0 to (total-1). Knowing this, we can get the URI (an IPFS hash)
    // for each NFT.
    for(var i = 0; i < total; i++) {
      const IPFSHash = await contract.methods.getURI(i).call();

      const newNFT = {
        URI: IPFSHash,
        URL: `${import.meta.env.VITE_GATEWAY_PRE}${IPFSHash}${import.meta.env.VITE_GATEWAY_POST}`,
        owner: await contract.methods.getSeller(i).call(),
        selling: await contract.methods.isSelling(i).call(),
        tokenId: i,
        price: Number(await contract.methods.getPrice(i).call())
      };

      NFTList.value.push(newNFT);

      // If all the NFTs are loaded, then the skeleton can be removed.
      if (i === (total - 1)) {
        skeletonStyle.value = 'display:none;';
        dataStyle.value = 'display:block;';
      }
    }
  })
});

// Gets how we should display the tag for each NFT.
const getSeverity = (NFT) => {
  switch (NFT.selling) {
    case true:
      return 'success';
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
</script>


<!-- HTML -->
<template>
  <!-- DataView -->
  <div class="card" :style="dataStyle">
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
      </template>

      <!-- Actual DataView: Grid View -->
      <template #list="slotProps" class="font-overflow" :display="displayGrid">
        <div class="grid grid-nogutter font-overflow">
          <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
            <div class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3" :class="{ 'border-top-1 surface-border': index !== 0 }">
              <div class="md:w-10rem relative">
                <Image class='nft-img' imageClass="nft-img block xl:block mx-auto border-round w-full" :id="item.URI" :src="item.URL" :alt="item.URI" preview></Image>
                <Tag :value="item.selling === true ? `SELLING` : `NOTFORSALE`" :severity="getSeverity(item)" class="absolute" style="left: 4px; top: 4px"></Tag>
              </div>
              <div class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-4">
                <div class="flex flex-row md:flex-column justify-content-between align-items-start gap-2">
                  <div class="font-overflow">
                    <span class="font-overflow font-medium text-secondary text-sm" style="padding:5%;">ITM #{{ item.tokenId }}</span>
                  </div>
                  <div class="surface-100 p-1" style="border-radius: 30px">
                    <div class="surface-0 flex align-items-center gap-2 justify-content-center py-1 px-2" style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)">
                      <span class="font-overflow text-900 font-medium text-sm">{{ item.owner }}</span>
                      <i class="pi pi-user text-purple-500"></i>
                    </div>
                  </div>
                </div>
                <div class="flex flex-column md:align-items-end gap-5">
                  <span class="text-xl font-semibold text-900">{{ item.price }} MATIC</span>
                  <div class="flex flex-row-reverse md:flex-row gap-2">
                    <Button icon="pi pi-shopping-cart" label="Buy Now" :disabled="!item.selling" class="flex-auto md:flex-initial white-space-nowrap"></Button>
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
                  <Tag :value="item.selling === true ? `SELLING` : `NOTFORSALE` " :severity="getSeverity(item)" class="absolute" style="left: 4px; top: 4px"></Tag>
                </div>
              </div>
              <div class="pt-4 font-overflow">
                <div class="flex flex-row justify-content-between align-items-start gap-2">
                  <div>
                    <span class="font-overflow font-medium text-secondary text-sm">ITM #{{ item.tokenId }}</span>
                  </div>
                  <div class="surface-100 p-1 font-overflow" style="border-radius: 30px">
                    <div class="surface-0 flex align-items-center gap-2 justify-content-center py-1 px-2" style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)">
                      <span class="font-overflow text-900 font-medium text-sm">{{ item.owner }}</span>
                      <i class="pi pi-user text-purple-500"></i>
                    </div>
                  </div>
                </div>
                <div class="flex flex-column gap-4 mt-4">
                  <span class="font-overflow text-2xl font-semibold text-900">{{ item.price }} MATIC</span>
                  <div class="flex gap-2">
                    <Button icon="pi pi-shopping-cart" label="Buy Now" :disabled="!item.selling" class="flex-auto white-space-nowrap"></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>



  <!-- Skeleton: for loading. -->
  <DataView class="card" :value="NFTList" :layout="layout" paginator :rows="20" :style="skeletonStyle">
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
.card {
  margin-top: 0px;
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