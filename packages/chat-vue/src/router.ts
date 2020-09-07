import Vue from 'vue';
import Router from 'vue-router';
import Cookies from 'js-cookie';

import {isAuthorized} from './utils/auth';

Vue.use(Router);

const router = new Router({
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

router.beforeEach((to, from, next) => {
  // if no cookies set, go to login
  if ((to.name !== 'login') && !Cookies.get('userId')) {
    next({name: 'login'});
    return;
  }
  if ((to.name !== 'login') && !isAuthorized()) {
    next({name: 'login'});
    return;
  }
  next();
});

export default router;
