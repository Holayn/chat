import Vue from 'vue';
import Vuex from 'vuex';
import {default as io} from 'socket.io-client';

import {API_URL} from './shared';

import { IChat, ISession, IUser, Chat } from '@chat/shared';

import { getUserByUsername } from './user';
import { getSessions } from './session';
import { getChats } from './chat';
import { mapMutations, mapGetters } from './store-mappers';

Vue.use(Vuex);

let socket: any;

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
    async sendChat({commit, getters, dispatch}, {message, sessionId}: {
      message: string;
      sessionId: string},
    ) {
      const chat = Chat.createChat(sessionId, getters.user.userId, message);
      commit('addChat', chat);
      if (!socket) {
        await dispatch('connect');
      }
      socket.emit('chat', chat);
    },
    async connect({commit, getters}) {
      socket = io.connect(`${API_URL}?user_id=${getters.user.userId}`);
      return new Promise<boolean>((resolve) => {
        socket.on('ack', (data: any) => {
          console.log(data);
          resolve(true);
        });

        socket.on('chat', (chat: Chat) => {
          console.log(chat);
          commit('addChat', chat);
        });
      });
    },
  },
});
