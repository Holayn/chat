import Vue from 'vue';
import Vuex from 'vuex';

import { IChat, ISession, Chat } from '@chat/shared';

import { getSessions } from './session';
import { fetchChats } from './chat';
import { mapMutations, mapGetters } from './store-mappers';
import {userModule} from './store-modules/user';
import {Socket} from './sockets';

interface IFrontendChat extends IChat {
  sent?: boolean;
}

Vue.use(Vuex);

const store = new Vuex.Store({
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
    markSessionAsRead: (state, sessionId: string) => {
      const sessionToMutate = state.sessions.filter((session) => {
        return sessionId === session.sessionId;
      })[0];

      Vue.set(sessionToMutate, 'read', true);
    },
    markSessionAsUnread: (state, sessionId: string) => {
      const sessionToMutate = state.sessions.filter((session) => {
        return sessionId === session.sessionId;
      })[0];

      Vue.set(sessionToMutate, 'read', false);
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
    async sendChat({commit, getters}, {message, session}: {
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
      Socket.emit('chat', {chat, session}, () => {
        chatToStore.sent = true;
      });
    },
    async readChats({commit}, session: ISession) {
      if (session.read) {
        return;
      }
      Socket.emit('readChat', {session});
      commit('markSessionAsRead', session.sessionId);
    },
    async initialize({dispatch}) {
      dispatch('initializeUserInfo');
    },
  },
});

export default store;
