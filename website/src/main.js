import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';

// Themes for the website. Default theme is indigo.
import 'primevue/resources/themes/aura-dark-indigo/theme.css';

const app = createApp(App);

app.use(PrimeVue);
app.use(router);


// Mount the application at the end.
app.mount('#app');
