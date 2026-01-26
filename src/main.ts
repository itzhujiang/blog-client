import { createPinia } from 'pinia';
import { createApp } from 'vue';

import './style.css';
import App from './App.vue';
import { router } from './router/index';

import { LoadingPlugin } from '@/directives/loadingDirective';

createApp(App).use(createPinia()).use(LoadingPlugin).use(router).mount('#app');
