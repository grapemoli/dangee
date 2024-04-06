import 'primevue/resources/primevue.min.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';


const app = createApp(App);
app.use(router);


// Web3 Authentication. For now, we set the chain to the Mumbai testnet; however,
// be sure to set this to the actual polygon mainnet production.
import { use } from "@maticnetwork/maticjs";
import { Web3ClientPlugin } from '@maticnetwork/maticjs-web3';
use(Web3ClientPlugin);


// Store for state. Used for authentication.
import store from './store';
app.use(store);


// Check if user is already logged in and update the global userWalletAddress variable.
// This works because MetaMasks injects a global API into the web browser, named "userWalletAddress,"
// when the user is logged in.
window.userWalletAddress = window.localStorage.getItem("userWalletAddress");


// Initialize the smart contract in the store. Set its state as needed.
const web3 = new Web3(store.state.rpc);
store.state.contract = new web3.eth.Contract(JSON.parse(store.state.abi), store.state.contractId);
store.state.contract.events.allEvents();

// Set the balance if the user exists.
store.dispatch('updateBalance');


// PrimeVue Assets for the application.
import 'primeicons/primeicons.css';
import PrimeVue from 'primevue/config';

import Button from "primevue/button";
import Card from 'primevue/card';
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import Image from 'primevue/image';
import Menubar from 'primevue/menubar';
import Message from 'primevue/message';
import Paginator from 'primevue/paginator';
import ProgressSpinner from 'primevue/progressspinner';
import TabMenu from "primevue/tabmenu";
import Tag from 'primevue/tag';
import ToggleButton from 'primevue/togglebutton';
import Skeleton from 'primevue/skeleton';

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
app.component('DataView', DataView);
app.component('DataViewLayoutOptions', DataViewLayoutOptions);
app.component('Divider', Divider);
app.component('Dropdown', Dropdown);
app.component('Image', Image);
app.component('Menubar', Menubar);
app.component('Message', Message);
app.component('Paginator', Paginator);
app.component('ProgressSpinner', ProgressSpinner);
app.component('Tag', Tag);
app.component('ToggleButton', ToggleButton);

app.component('ConfirmDialog', ConfirmDialog);
app.use(ConfirmationService);
app.component('Toast', Toast);
app.use(ToastService);

app.component('TabMenu', TabMenu);
app.component('Skeleton', Skeleton);


// Mount the application at the end.
app.mount('#app');
