import 'primevue/resources/primevue.min.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';


const app = createApp(App);
app.use(router);


// Store for state. Used for authentication.
import store from './store';
app.use(store);


// Check if user is already logged in and update the global userWalletAddress variable.
// This works because MetaMasks injects a global API into the web browser, named "userWalletAddress,"
// when the user is logged in.
window.userWalletAddress = window.localStorage.getItem("userWalletAddress");


// Initialize the smart contract in the store. Set its state as needed.
// Note that the Web3 provider here the window.ethereum injection from MetaMask if the user has
// MetaMask installed. Elsewise, we make the provider the rpc.
const web3socket = new Web3(new Web3.providers.WebsocketProvider('wss://polygon-mumbai-bor-rpc.publicnode.com'));
const web3 = new Web3((window.ethereum && window.ethereum.isMetaMask) ? window.ethereum : store.state.rpc)
store.state.contract = new web3.eth.Contract(JSON.parse(store.state.abi), store.state.contractId);
store.state.websocket = new web3socket.eth.Contract(JSON.parse(store.state.abi), store.state.contractId);


// Set the information if the user exists.
store.dispatch('updateBalance');
store.dispatch('updateMinter');
store.dispatch('updateGasFee');
store.dispatch('updateNFTList');


// PrimeVue Assets for the application.
import 'primeicons/primeicons.css';
import PrimeVue from 'primevue/config';

import Button from "primevue/button";
import BlockUI from 'primevue/blockui';
import Card from 'primevue/card';
import Carousel from 'primevue/carousel';
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import FileUpload from 'primevue/fileupload';
import FloatLabel from 'primevue/floatlabel';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputNumber from 'primevue/inputnumber';
import InputSwitch from 'primevue/inputswitch';
import Image from 'primevue/image';
import Menubar from 'primevue/menubar';
import Paginator from 'primevue/paginator';
import ProgressSpinner from 'primevue/progressspinner';
import Skeleton from 'primevue/skeleton';
import SpeedDial from 'primevue/speeddial';
import Steps from 'primevue/steps';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import TabMenu from "primevue/tabmenu";
import Tag from 'primevue/tag';
import ToggleButton from 'primevue/togglebutton';
import Tooltip from 'primevue/tooltip';

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
app.component('BlockUI', BlockUI);
app.component('Card', Card);
app.component('Carousel', Carousel);
app.component('DataView', DataView);
app.component('DataViewLayoutOptions', DataViewLayoutOptions);
app.component('Dialog', Dialog);
app.component('Divider', Divider);
app.component('Dropdown', Dropdown);
app.component('FileUpload', FileUpload);
app.component('FloatLabel', FloatLabel);
app.component('IconField', IconField);
app.component('InputIcon', InputIcon);
app.component('InputNumber', InputNumber);
app.component('InputSwitch', InputSwitch);
app.component('Image', Image);
app.component('Menubar', Menubar);
app.component('Paginator', Paginator);
app.component('ProgressSpinner', ProgressSpinner);
app.component('Skeleton', Skeleton);
app.component('SpeedDial', SpeedDial);
app.component('Steps', Steps);
app.component('Stepper', Stepper);
app.component('StepperPanel', StepperPanel);
app.component('Tag', Tag);
app.component('ToggleButton', ToggleButton);

app.component('ConfirmDialog', ConfirmDialog);
app.use(ConfirmationService);
app.component('Toast', Toast);
app.use(ToastService);
app.directive('tooltip', Tooltip);

app.component('TabMenu', TabMenu);


// Mount the application at the end.
app.mount('#app');
