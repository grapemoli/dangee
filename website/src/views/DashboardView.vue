<!-- JavaScript -->
<script setup>
import { ref, watch, computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex'

const store = useStore();

const walletId = computed(() => store.getters["userId"]);
const isAuth = computed(() => store.getters["isAuth"]);
const balance = ref(0);


if (window.ethereum && isAuth.value) {
  const web3 = new Web3(window.ethereum);
  web3.eth.getBalance(store.getters['userId']).then((result) => {
    balance.value = web3.utils.fromWei(result, "ether");
  });
}

watch((walletId) => {
  if (window.ethereum && isAuth.value) {
    const web3 = new Web3(window.ethereum);
    web3.eth.getBalance(store.getters['userId']).then((result) => {
      balance.value = web3.utils.fromWei(result, "ether");
    });
  }
})
</script>


<!-- HTML -->
<template>
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
      </table>



    </template>
  </Card>
</template>


<!-- CSS -->
<style>
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
