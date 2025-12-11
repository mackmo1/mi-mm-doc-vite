import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import "./scss/main.scss";
import Trumbowyg from 'vue-trumbowyg';

createApp(App).use(store).use(Trumbowyg).mount('#app');

