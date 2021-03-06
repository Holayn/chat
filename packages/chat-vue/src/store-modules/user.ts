import {IUser} from '@chat/shared';
import Cookies from 'js-cookie';
import decode from 'jwt-decode';
import {ActionContext} from 'vuex';

import {Socket} from '@/sockets';
import router from '../router';
import {mapGetters, mapMutations} from '../store-mappers';
import {createAccount, login} from '../user';

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
    setUser({commit}: ActionContext<any, any>, userInfo: IUser) {
      commit('user', userInfo);
    },
    async login({commit}: ActionContext<any, any>, {username, password}: {username: string, password: string}) {
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
    logout({commit}: ActionContext<any, any>) {
      Cookies.remove('token');
      commit('user', {});
      router.push({name: 'login'});
      Socket.disconnect();
    },
    async createAccount(
      {},
      {username, password, email, name}: {
        username: string,
        password: string,
        email: string,
        name: string}) {
      return await createAccount(username, password, email, name);
    },
    initializeUserInfo({commit}: ActionContext<any, any>) {
      const jwt = Cookies.get('token');
      if (jwt) {
        const userInfo = decode<IUser>(jwt);
        commit('user', userInfo);
      }
    },
  },
};
