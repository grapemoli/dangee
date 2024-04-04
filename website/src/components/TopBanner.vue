<!-- TopBanner.vue
  -- This component refers to the shared top-banner that facilitates
  -- movement across different pages. It is used in all pages of this application.
  -->

<!-- JavaScript -->
<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { ref, onMounted, watch, computed } from 'vue';
import { usePrimeVue } from 'primevue/config';
import { useStore } from 'vuex'

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
    icon: 'pi pi-bitcoin',
    route: '/login'
  },
  {
    label: 'Library',
    icon: 'pi pi-shop',
    route: '/login'
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
})

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
})
</script>


<!-- HTML -->
<template>
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
