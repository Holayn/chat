import {IUser} from '@chat/shared';
import Cookies from 'js-cookie';
import decode from 'jwt-decode';

import { login } from '../user';
import { mapMutations, mapGetters } from '../store-mappers';
import router from '../router';

interface IUserState {
  user: IUser;
}

export const userModule = {
  state: {
    user: {} as IUser,
  },
  mutations: {
    ...mapMutations(['user']),
  },
  getters: {
    ...mapGetters(['user']),
    hasUser(state: IUserState) {
      return !!Object.keys(state.user).length;
    },
  },
  actions: {
    setUser({commit}: any, userInfo: IUser) {
      commit('user', userInfo);
    },
    async login({dispatch}: any, {username, password}: {username: string, password: string}) {
      const jwt = await login(username, password);
      if (jwt) {
        Cookies.set('token', jwt);
        const userInfo = decode<IUser>(jwt);
        dispatch('setUser', userInfo);
        router.push({name: 'messages'});
      }
    },
    logout({commit}: any) {
      Cookies.remove('token');
      commit('user', {});
      router.push({name: 'login'});
    },
    initializeUserInfo({dispatch}: any) {
      const jwt = Cookies.get('token');
      if (jwt) {
        const userInfo = decode<IUser>(jwt);
        dispatch('setUser', userInfo);
      }
    },
  },
};
