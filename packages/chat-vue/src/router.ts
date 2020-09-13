import Vue from 'vue';
import Router from 'vue-router';

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
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue'),
      children: [
        {
          path: '/messages',
          name: 'messages',
          component: () => import(/* webpackChunkName: "messages" */ './views/Messages.vue'),
        },
      ]
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  console.log(`Router :: to:${to.name}, from:${from.name}`);
  // if no cookies set, go to login
  if (to.name !== 'login') {
    const isAuthed = await isAuthorized();
    if (!isAuthed) {
      next({name: 'login'});
      return;
    }
  }
  if (to.name === 'login') {
    const isAuthed = await isAuthorized();
    if (isAuthed) {
      next({name: 'messages'});
      return;
    }
  }
  next();
});

export default router;
