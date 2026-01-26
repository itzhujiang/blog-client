import { createWebHashHistory, createRouter } from 'vue-router';

import { routes } from './route';

import { TOKEN } from '@/utils/constants';

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, _form, next) => {
  if (!localStorage.getItem(TOKEN) && to.path !== '/login') {
    next('/login');
  } else {
    next();
  }
});
