<!-- TopBanner.vue
  -- This component refers to the shared top-banner that facilitates
  -- movement across different pages. It is used in all pages of this application.
  -->

<!-- JavaScript -->
<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { usePrimeVue } from 'primevue/config';

const PrimeVue = usePrimeVue();

const currentTheme = ref('aura-light-purple');
const checked = ref(false);
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
        route: '/login'
      },
      {
        label: 'Login',
        icon: 'pi pi-sign-in',
        route: '/login'
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        route: '/login'
      },
    ]
  }
]);
</script>


<!-- HTML -->
<template>
  <header>
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
  </header>
</template>


<!-- CSS -->
<style>
</style>
