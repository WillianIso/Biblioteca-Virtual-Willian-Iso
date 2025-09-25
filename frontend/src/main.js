import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify.js'
import VueTheMask from "vue-the-mask";
import './assets/style.css';
import store from './store';

createApp(App)
  .use(router)
  .use(vuetify)
  .use(VueTheMask)
  .use(store)
  .mount('#app')
