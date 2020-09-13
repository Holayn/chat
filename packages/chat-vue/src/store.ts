import Vue from 'vue';
import Vuex from 'vuex';
import {default as io, Socket} from 'socket.io-client';

import {API_URL} from './shared';

import { IChat, ISession, Chat } from '@chat/shared';

import { getSessions } from './session';
import { fetchChats } from './chat';
import { mapMutations, mapGetters } from './store-mappers';
import {userModule} from './store-modules/user';

interface IFrontendChat extends IChat {
  sent?: boolean;
}

Vue.use(Vuex);

let socket: typeof Socket;

export default new Vuex.Store({
  modules: {
    userModule,
  },
  state: {
    sessions: [] as ISession[],
    chats: {} as {
      [session: string]: {
        chats: IFrontendChat[];
        fetched: boolean;
      },
    },
  },
  mutations: {
    ...mapMutations(['user', 'sessions']),
    addChat: (state, {
      chat,
      session,
    }: {chat: IFrontendChat, session: ISession}) => {
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
      state.chats[payload.session.sessionId].chats = payload.chats as IFrontendChat[];
      state.chats[payload.session.sessionId].fetched = true;
    },
  },
  getters: {
    ...mapGetters(['sessions', 'chats']),
  },
  actions: {
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
          chats: [...await fetchChats(session.sessionId), ...state.chats[session.sessionId].chats],
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
      const chatToStore: IFrontendChat = {
        ...chat,
        sent: false,
      }
      commit('addChat', {chat: chatToStore, session, sent: false});
      if (!socket) {
        await dispatch('connect');
      }
      socket.emit('chat', {chat, session}, () => {
        chatToStore.sent = true;
      });
    },
    async initialize({dispatch, getters}) {
      dispatch('initializeUserInfo');
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
