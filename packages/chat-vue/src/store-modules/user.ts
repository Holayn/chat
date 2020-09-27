import {IUser} from '@chat/shared';
import Cookies from 'js-cookie';
import decode from 'jwt-decode';

import { createAccount, login } from '../user';
import { mapGetters, mapMutations } from '../store-mappers';
import router from '../router';

interface IUserState {
  user: IUser;
}

const stateProperties = ['user'];

export const userModule = {
  state: {
    user: {} as IUser,
  },
  mutations: {
    ...mapMutations(stateProperties),
  },
  getters: {
    ...mapGetters(stateProperties),
    hasUser(state: IUserState) {
      return !!Object.keys(state.user).length;
    },
  },
  actions: {
    setUser({commit}: any, userInfo: IUser) {
      commit('user', userInfo);
    },
    async login({commit}: any, {username, password}: {username: string, password: string}) {
      const jwt = await login(username, password);
      if (jwt) {
        Cookies.set('token', jwt);
        const userInfo = decode<IUser>(jwt);
        commit('user', userInfo);
        router.push({name: 'messages'});
        return true;
      }
      return false;
    },
    logout({commit, dispatch}: any) {
      Cookies.remove('token');
      commit('user', {});
      router.push({name: 'login'});
      dispatch('disconnect');
    },
    async createAccount({}, {username, password, email, name}: {username: string, password: string, email: string, name: string}) {
      return await createAccount(username, password, email, name);
    },
    initializeUserInfo({commit}: any) {
      const jwt = Cookies.get('token');
      if (jwt) {
        const userInfo = decode<IUser>(jwt);
        commit('user', userInfo);
      }
    },
  },
};
