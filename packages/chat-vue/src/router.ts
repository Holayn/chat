import { createRouter, createWebHistory } from 'vue-router';
import { defineAsyncComponent } from 'vue'

export default createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: defineAsyncComponent(() => import(/* webpackChunkName: "login" */ './views/Login.vue')),
    },
    {
      path: '/messages',
      name: 'messages',
      component: defineAsyncComponent(() => import(/* webpackChunkName: "messages" */ './views/Messages.vue')),
    },
  ],
});
