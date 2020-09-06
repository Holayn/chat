import Vue from 'vue';
import Vuex from 'vuex';
import {default as io} from 'socket.io-client';

import {API_URL} from './shared';

import { IChat, ISession, IUser, Chat } from '@chat/shared';

import { getUserByUsername } from './user';
import { getSessions } from './session';
import { fetchChats } from './chat';
import { mapMutations, mapGetters } from './store-mappers';

Vue.use(Vuex);

let socket: any;

export default new Vuex.Store({
  state: {
    user: {} as IUser,
    sessions: [] as ISession[],
    chats: {} as {
      [session: string]: {
        chats: Chat[];
        fetched: boolean;
      },
    },
  },
  mutations: {
    ...mapMutations(['user', 'sessions']),
    addChat: (state, {
      chat,
      session,
    }: {chat: IChat, session: ISession}) => {
      state.chats[session.sessionId].chats.push(chat);
    },
    addSession: (state, session) => {
      state.sessions.push(session);
      Vue.set(state.chats, session.sessionId, {
        chats: [],
        fetched: false,
      });
    },
    chats: (state, payload: {
      chats: IChat[];
      session: ISession;
    }) => {
      state.chats[payload.session.sessionId].chats = payload.chats;
      state.chats[payload.session.sessionId].fetched = true;
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
    async addSession({commit}, session: ISession) {
      commit('addSession', session);
    },
    async getSessions({commit, getters, state}) {
      const sessions = await getSessions(getters.user.userId);
      sessions.forEach((session) => {
        Vue.set(state.chats, session.sessionId, {
          chats: [],
          fetched: false,
        });
      });
      commit('sessions', sessions);
    },
    async getChats({commit, state}, session: ISession) {
      if (!state.chats[session.sessionId].fetched) {
        commit('chats', {
          chats: [...state.chats[session.sessionId].chats, ...await fetchChats(session.sessionId)],
          session,
        });
      }
    },
    async sendChat({commit, getters, dispatch}, {message, session}: {
      message: string;
      session: ISession;
    },
    ) {
      const chat = Chat.createChat(session.sessionId, getters.user.userId, message);
      commit('addChat', {chat, session});
      if (!socket) {
        await dispatch('connect');
      }
      socket.emit('chat', {chat, session});
    },
    async connect({commit, getters}) {
      socket = io.connect(`${API_URL}?user_id=${getters.user.userId}`);
      return new Promise<boolean>((resolve) => {
        socket.on('ack', (data: any) => {
          resolve(true);
        });

        socket.on('chat', (payload: {
          chat: IChat,
          session: ISession,
        }) => {
          if (!getters.chats[payload.session.sessionId]) {
            commit('addSession', payload.session);
            // do not add chat, since it's a new session and we're going to be fetching the chats
            return;
          }
          commit('addChat', payload);
        });
      });
    },
  },
});
