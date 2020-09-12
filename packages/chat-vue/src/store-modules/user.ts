import {IUser} from '@chat/shared';
import Cookies from 'js-cookie';

import { getUserByUsername, login, getUserById } from '../user';
import { mapMutations, mapGetters } from '../store-mappers';

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
    setUser({commit}: any, userInfo: any) {
      commit('user', userInfo);
    },
    async login({dispatch}: any, {username, password}: {username: string, password: string}) {
      if (login(username, password)) {
        const userInfo = await getUserByUsername(username);
        if (userInfo) {
          Cookies.set('userId', userInfo.userId);
          dispatch('setUser', userInfo);
        }
      }
    },
    async initializeUserInfo({dispatch}: any) {
      const userId = Cookies.get('userId');
      if (userId) {
        const userInfo = await getUserById(userId);
        dispatch('setUser', userInfo);
      }
    },
  },
};
