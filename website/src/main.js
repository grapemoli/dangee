import 'primevue/resources/primevue.min.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';


const app = createApp(App);
app.use(router);


// Web3 Authentication. For now, we set the chain to the Mumbai testnet; however,
// be sure to set this to the actual polygon mainnet production.


// Store for state. Used for authentication.
import store from './store';
app.use(store);

// Check if user is already logged in and update the global userWalletAddress variable.
// This works because MetaMasks injects a global API into the web browser, named "userWalletAddress,"
// when the user is logged in.
window.userWalletAddress = window.localStorage.getItem("userWalletAddress");


// PrimeVue Assets for the application.
import 'primeicons/primeicons.css';
import PrimeVue from 'primevue/config';

import Button from "primevue/button";
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import Image from 'primevue/image';
import Menubar from 'primevue/menubar';
import ProgressSpinner from 'primevue/progressspinner';
import TabMenu from "primevue/tabmenu";
import ToggleButton from 'primevue/togglebutton';

import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmationService from 'primevue/confirmationservice';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';


app.use(PrimeVue, {
    unstyled: false,
    ripple: true,
    inputStyle: 'outlined'
});

app.component('Button', Button);
app.component('Card', Card);
app.component('Image', Image);
app.component('Menubar', Menubar);
app.component('ProgressSpinner', ProgressSpinner);
app.component('ToggleButton', ToggleButton);

app.component('ConfirmDialog', ConfirmDialog);
app.use(ConfirmationService);
app.component('Toast', Toast);
app.use(ToastService);

app.component('Divider', Divider);
app.component('TabMenu', TabMenu);




// Mount the application at the end.
app.mount('#app');
