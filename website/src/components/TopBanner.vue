<!-- TopBanner.vue
  -- This component refers to the shared top-banner that facilitates
  -- movement across different pages. It is used in all pages of this application.
  -- Functionality: Top-Menu, Common Alerts/Notifications/Toasts.
  -->

<!-- JavaScript -->
<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { ref, onMounted, watch, computed } from 'vue';
import { usePrimeVue } from 'primevue/config';
import { useStore } from 'vuex';
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();
const store = useStore();
const PrimeVue = usePrimeVue();

const currentTheme = ref('aura-light-purple');
const checked = ref(false);
const isAuthed = computed(() => store.getters["isAuth"]);

const logo = ref("logo_highres.png")

/**
 * Toggles the currentTheme between light and dark mode. Also toggles icon.
 */
const toggleTheme = () => {
  let nextTheme = (currentTheme.value === 'aura-light-purple' ? 'aura-dark-purple' : 'aura-light-purple');
  PrimeVue.changeTheme(currentTheme.value, nextTheme, 'theme-link', () => {});

  logo.value = (nextTheme === 'aura-light-purple') ? "logo_highres.png" : "light_logo_highres.png";

  currentTheme.value = nextTheme;
}


const menuItems = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    route: '/',
  },
  {
    label: 'Market',
    icon: 'pi pi-shopping-cart',
    route: '/marketplace'
  },
  {
    label: 'Library',
    icon: 'pi pi-shop',
    route: '/library'
  },
  {
    label: 'Account',
    icon: 'pi pi-user',
    items: [
      {
        label: 'Dashboard',
        icon: 'pi pi-info-circle',
        route: '/dashboard'
      },
      {
        label: '',
        icon: '',
        route: ''
      }
    ]
  }
]);

// Dynamically add/remove the login and logout option based on the user's authentication status.
// This is done by 'toggling' between the login and logout icons and label.
onMounted(() => {
  if (isAuthed.value) {
    // User is logged in. Render logout button.
    menuItems.value[3].items[1].label = 'Logout';
    menuItems.value[3].items[1].icon = 'pi pi-sign-out';
    menuItems.value[3].items[1].route = '/logout';
  }
  else {
    // User is logged out. Render login button.
    menuItems.value[3].items[1].label = 'Login';
    menuItems.value[3].items[1].icon = 'pi pi-sign-in';
    menuItems.value[3].items[1].route = '/login';
  }
});

// Watches for if the user logs in to change the login/logout button.
watch (isAuthed, () => {
  // Toggle the login vs logout option.
  if (isAuthed.value) {
    // User is logged in. Render logout button.
    menuItems.value[3].items[1].label = 'Logout';
    menuItems.value[3].items[1].icon = 'pi pi-sign-out';
    menuItems.value[3].items[1].route = '/logout';
  }
  else {
    // User is logged out. Render login button.
    menuItems.value[3].items[1].label = 'Login';
    menuItems.value[3].items[1].icon = 'pi pi-sign-in';
    menuItems.value[3].items[1].route = '/login';
  }
});

// Set up event listener for the smart contract. The events we listen to are:
// (1) NewItem @returnValues=(address sender, uint256 tokenId, uint256 price);
// (2) PriceUpdate @returnValues=(address owner, uint256 indexed tokenId, uint256 oldPrice, uint256 newPrice);
// (3) ItemForSale @returnValues=(address seller, uint256 indexed tokenId, uint256 price);
// (4) ItemSold @returnValues=(address seller, address buyer, uint256 indexed tokenId, uint256 price);
// Note that the event listener in the TopBanner is in charge of toast messages and store-updates, as
// the TopBanner is persistent across all routes. Specific changes to specific routes, e.g., the Marketplace,
// will have their own instance.
const websocket = store.getters['websocket'];

websocket.events.allEvents({}, (error, event) => {

  if (event) {

    switch (event.event) {
      case 'NewItem': {

        // Inform the user, if they are the owner, that their NFT is on the marketplace.
        // Also, update the owner's store.
        if (event.returnValues.sender.toLowerCase() === store.getters['userId']) {
          store.dispatch('addNFT', event.returnValues.tokenId);
          toast.add({ severity: 'success', summary: `Minted ITM#${event.returnValues.tokenId}!`, detail: `Your minted ITM is now on the marketplace!`, life: 5000 });
          router.push({path: '/library'});
        }

        break;
      }

      case 'PriceUpdate': {

        // If the user is the owner, tell them about this. Also, update their store.
        if (event.returnValues.owner.toLowerCase() === store.getters['userId']) {
          store.dispatch('updateNFTPrice', [event.returnValues.tokenId, event.returnValues.newPrice]);
          toast.add({ severity: 'info', summary: `Successfully updated ITM#${event.returnValues.tokenId}!`, detail: `Price updated from ${event.returnValues.oldPrice} MATIC to ${event.returnValues.newPrice} MATIC.`, life: 5000 });
        }

        break;
      }
      case 'ItemForSale': {

        // If the user is the owner, tell them about this, and update the store.
        if (event.returnValues.seller.toLowerCase() === store.getters['userId']) {
          store.dispatch('updateNFTSell', [event.returnValues.tokenId, true]);
          toast.add({ severity: 'info', summary: `ITM#${event.returnValues.tokenId} is on the market!`, detail: `Your ITM can now be bought by other users on dangee.`, life: 5000 });
        }

        break;
      }

      case 'ItemNotForSale': {

        // If the user is the owner, tell them about this, and update the store.
        if (event.returnValues.seller.toLowerCase() === store.getters['userId']) {
          store.dispatch('updateNFTSell', [event.returnValues.tokenId, false]);
          toast.add({ severity: 'info', summary: `ITM#${event.returnValues.tokenId} is off the market!`, detail: `Your ITM can no longer be bought by other users on dangee.`, life: 5000 });
        }

        break;
      }
      case 'ItemSold': {

        // If the user is the seller or buyer, tell them about this successful transaction.
        // Update both their respective stores.
        if (event.returnValues.seller.toLowerCase() === store.getters['userId']) {
          // For the seller, we remove the item from the store.
          store.dispatch('removeNFT', event.returnValues.tokenId);
          toast.add({ severity: 'info', summary: `Successfully Sold ITM#${event.returnValues.tokenId}!`, detail: `User ${event.returnValues.seller} successfully bought ITM${event.returnValues.tokenId}!`, life: 5000 });
        }
        else if (event.returnValues.buyer.toLowerCase() === store.getters['userId']) {
          // For the buyer, we add the item to the store.
          store.dispatch('addNFT', event.returnValues.tokenId);
          toast.add({ severity: 'info', summary: `Successfully Bought ITM#${event.returnValues.tokenId}!`, detail: `This ITM is now yours! You can view it in your library, or on the market.`, life: 5000 });
        }

        break;
      }
      default: {
        console.log(event.event)
        break;
      }
    }
  }
})
    .on('connected', (subscriptionId) => console.log(`Banner SubscriptionID ${subscriptionId}`))
    .on('error', (error) => {

      // The network rejected the transaction somehow. This is a rare occurrence,
      // so just print the error as-is.
      toast.add({ severity: 'error', summary: 'Transaction Rejected by Network', detail: `${error}`, life: 5000 });
    });

</script>


<!-- HTML -->
<template>
  <Toast></Toast>

  <Menubar :model='menuItems'>

    <template #start>
      <Image id="logo" :src="logo" alt="Image" width="50"/>
    </template>

    <template #item="{ item, props, hasSubmenu }">
      <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
          <span :class="item.icon" />
          <span class="ml-2">&nbsp;{{ item.label }}</span>
        </a>
      </router-link>
      <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
        <span :class="item.icon" />
        <span class="ml-2">&nbsp;{{ item.label }}</span>
        <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
      </a>
    </template>

    <template #end>
      <ToggleButton v-model="checked"  @click="toggleTheme()" onLabel="Dark" offLabel="Light"
                    onIcon="pi pi-moon"
                    offIcon="pi pi-sun"/>
    </template>
  </Menubar>
</template>


<!-- CSS -->
<style>
</style>
