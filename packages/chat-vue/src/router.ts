import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue'),
    },
    {
      path: '/messages',
      name: 'messages',
      component: () => import(/* webpackChunkName: "messages" */ './views/Messages.vue'),
    },
  ],
});
