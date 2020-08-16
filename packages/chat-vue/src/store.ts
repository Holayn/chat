import { createStore } from 'vuex';

import { getUserByUsername } from './user';
import { getSessions } from './session';
import { getChats } from './chat';
import { mapMutations, mapGetters } from './store-mappers';

import {IUser} from './user';
import {ISession} from './session';
import {IChat} from './chat';

export default createStore({
  state: {
    user: {} as IUser,
    sessions: [] as ISession[],
    chats: [] as IChat[],
  },
  mutations: {
    ...mapMutations(['user', 'sessions', 'chats']),
  },
  getters: {
    ...mapGetters(['user', 'sessions', 'chats']),
    hasUser: (state) => {
      return !!Object.keys(state.user).length;
    },
  },
  actions: {
    setUser({commit}, userInfo: any) {
      commit('user', userInfo);
    },
    async login({dispatch}, username: string) {
      const userInfo = await getUserByUsername(username);
      dispatch('setUser', userInfo);
    },
    async getSessions({commit, getters}) {
      commit('sessions', await getSessions(getters.user['user-id']));
    },
    async getChats({commit}, sessionId: string) {
      commit('chats', await getChats(sessionId));
    }
  },
});
