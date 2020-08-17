import Vue from 'vue';
import Vuex from 'vuex';

import { IChat, ISession, IUser, Chat } from '@chat/shared';

import { getUserByUsername } from './user';
import { getSessions } from './session';
import { getChats } from './chat';
import { mapMutations, mapGetters } from './store-mappers';

import {sendChat} from './chat';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {} as IUser,
    sessions: [] as ISession[],
    chats: [] as IChat[],
  },
  mutations: {
    ...mapMutations(['user', 'sessions', 'chats']),
    addChat: (state, chat) => {
      state.chats.push(chat);
    },
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
      commit('sessions', await getSessions(getters.user.userId));
    },
    async getChats({commit}, sessionId: string) {
      commit('chats', await getChats(sessionId));
    },
    async sendChat({commit, getters}, {message, sessionId}: {
      message: string;
      sessionId: string},
    ) {
      const chat = Chat.createChat(sessionId, getters.user.userId, message);
      commit('addChat', chat);
      sendChat(chat);
    },
  },
});
