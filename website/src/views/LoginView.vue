<!-- JavaScript -->
<script setup>
import { useRouter } from 'vue-router';
import { ref, onBeforeMount } from 'vue';
import { useStore } from 'vuex'

const store = useStore();
const router = useRouter();
const errorMsg = ref('');
const isDisabled = ref(false);

window.userWalletAddress = null;

onBeforeMount(() => {
  // Check that the wallet is installed in the web browser.
  if (window.ethereum) {

    // Create Web3 instance.
    window.web3 = new Web3 (window.ethereum);
    errorMsg.value = "";
    isDisabled.value = false;
  } else {

    // If not installed, prompt the user to install metamask.
    errorMsg.value = "Please install MetaMask or any Polygon Extension Wallet to get started.";
    isDisabled.value = true;
  }
});


// Event handler for logging in with wallet.
// 1. Web3 login function
const loginWithEth = async () => {
  // The global window.web3 instance is only made when we detect a MetaMask account upon
  // entering the page.
  if (window.web3) {
    try {
      // Get the user's [ethereum] account - prompts MetaMask to login.
      const selectedAccount = await window.ethereum
          .request({
            method: "eth_requestAccounts",
          })
          .then((accounts) => accounts[0])    // Only use the first account.
          .catch(() => {
            // Throws this error if the user cancels the login prompt.
            throw Error("Please select an account");
          });

      // This code facilitates the user changing their account (if they have multiple).
      // Update the store.
      window.ethereum.on('accountsChanged', function (selectedAccount) {
        store.dispatch('login', selectedAccount[0]);
      });

      // Otherwise, login the user like normal & set the state (the store takes care of both).
      store.dispatch('login', selectedAccount);

      // Bring user back to the main page.
      router.push({path: '/'});

    } catch (error) {
      errorMsg.value = error;
    }
  } else {
    errorMsg.value = "Wallet not found.";
  }
};
</script>


<!-- HTML -->
<template>
  <!-- LOGIN SECTION -->
  <section class="login-section">
    <h1>welcome to dangee</h1>
    <Button class='p-button login-button' label="Connect Wallet" icon="pi pi-wallet" :disabled="isDisabled" @click="loginWithEth()"/>
    <p>{{errorMsg}}</p>
  </section>

  <!-- INFORMATION SECTION -->
  <section class="information-section">
    <Image class='animated-logo' src="/animated_logo.gif" alt="Animation of the Logo" width="250" />
  </section>

  <!-- DASHBOARD SECTION -->
  <!--
  <section class="dashboard-section">
    <h2 class="wallet-status">Wallet Connected! 🤝</h2>
    <h3 class="wallet-address-heading">
      ETH Wallet Address:
      <span class="wallet-address"></span>
    </h3>
    <h3 class="wallet-balance-heading">
      ETH Balance:
      <span class="wallet-balance"></span>
    </h3>
    <button class="logout-btn">🔐 Log out</button>
  </section>
  -->
</template>


<!-- CSS -->
<style>
.login-section {
  float: left;
  height: 50vh;
  width: 50%;
  padding-right: 3vh;
  padding-top: 3vh;

  .login-button {
    display: inline-flex;
    margin-left: 37%;
    margin-right: 37%;
  }

  h1 {
    font-family: "Bebas Neue", sans-serif;
    font-size: 10vh;
    font-weight: 400;
    font-style: normal;
    text-align:center;
  }

  p {
    text-align: center;
  }
}

.information-section {
  float: right;
  height: 100vh;
  width: 50%;
  background-color: #000000;
  text-align: center;
  justify-content: center;

  .animated-logo {
  }
}
</style>