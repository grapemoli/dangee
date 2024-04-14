<!-- JavaScript -->
<script setup>
import { useRouter } from 'vue-router';
import { ref, onBeforeMount } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();
const errorMsg = ref('');
const isDisabled = ref(false);
const contract = store.getters["contract"];

window.userWalletAddress = null;

onBeforeMount(() => {
  // Check that the wallet is installed in the web browser.
  if (window.ethereum && window.ethereum.isMetaMask) {
    errorMsg.value = "";
    isDisabled.value = false;
  } else {

    // If not installed, prompt the user to install metamask.
    errorMsg.value = "Please install MetaMask to get started.";
    isDisabled.value = true;
  }
});


// Event handler for logging in with wallet.
const loginWithEth = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);

    try {
      // Get the user's account - prompts MetaMask to login.
      const selectedAccount = await window.ethereum
          .request({
            method: "eth_requestAccounts",
          })
          .then(async (accounts) => accounts[0])
          .catch((err) => {
            // Throws this error if the user cancels the login prompt.
            throw Error("Please select an account");
          });

      // Final check for login: check if the user has the Polygon Mumbai Testnet on their MetaMask account.
      // Else, add it for the user (or, simply switch to it). Note that everything is in the store
      // for easy configuration.
      var onChain = false;
      const chainId = store.getters['chainId'];

      if (window.ethereum.networkVersion !== chainId) {
        // Try to switch the user to the chain.
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: web3.utils.toHex(chainId) }]
          });

          onChain = true;
        }
        catch (err) {
          // Error 4902 is thrown if the user does not have the chain on their MetaMask account.
          // In which case, we add the chain for them.
          if (err.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainName: store.getters['chainName'],
                  chainId: web3.utils.toHex(chainId),
                  nativeCurrency: { name: store.getters['tokenName'], decimals: store.getters['tokenDecimals'], symbol: store.getters['tokenSymbol'] },
                  rpcUrls: [store.getters['rpc']]
                }
              ]
            }).then(() => onChain = true ).catch((err) => {
              errorMsg.value = `Add the ${store.getters['chainName']} chain on MetaMask to continue.`;
            })
          }
          // General catch-all, ask the user to switch to MATIC; else, disallow login.
          else {
            errorMsg.value = `Add and switch to ${store.getters['chainName']} chain on MetaMask to continue.`;
          }
        }
      }

      // Otherwise, login the user like normal & set the state (the store takes care of both).
      if (onChain) {
        store.dispatch('login', selectedAccount);
      }

      // This facilitates the user switching accounts, and updates the store accordingly.
      if (window.ethereum && window.localStorage.getItem("userWalletAddress")) {
        window.ethereum.on('accountsChanged', function (selectedAccount) {
          store.dispatch('login', selectedAccount[0]);
        });
      }

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