import 'primevue/resources/primevue.min.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';


const app = createApp(App);
app.use(router);


// PrimeVue Assets for the application.
import 'primeicons/primeicons.css';
import PrimeVue from 'primevue/config';
import Button from "primevue/button";
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import Menubar from 'primevue/menubar';
import TabMenu from "primevue/tabmenu";
import ToggleButton from 'primevue/togglebutton';
import Image from 'primevue/image';


app.use(PrimeVue, {
    unstyled: false,
    ripple: true,
    inputStyle: 'outlined'
});

app.component('Card', Card);

app.component('Button', Button);
app.component('ToggleButton', ToggleButton);

app.component('Divider', Divider);
app.component('TabMenu', TabMenu);
app.component('Menubar', Menubar);
app.component('Image', Image);



// Mount the application at the end.
app.mount('#app');
