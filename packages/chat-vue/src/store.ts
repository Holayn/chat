import Vue from 'vue';
import Vuex from 'vuex';
import {default as io, Socket} from 'socket.io-client';

import { IChat, ISession, Chat } from '@chat/shared';

import {API_URL} from './shared';
import { getSessions } from './session';
import { fetchChats } from './chat';
import { mapMutations, mapGetters } from './store-mappers';
import {userModule} from './store-modules/user';
import {getToken} from './utils/auth';
import router from './router';

interface IFrontendChat extends IChat {
  sent?: boolean;
}

Vue.use(Vuex);

let socket: typeof Socket;

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
      emit('chat', {chat, session}, () => {
        chatToStore.sent = true;
      });
    },
    async readChats({commit}, session: ISession) {
      if (session.read) {
        return;
      }
      emit('readChat', {session});
      commit('markSessionAsRead', session.sessionId);
    },
    async initialize({dispatch}) {
      dispatch('initializeUserInfo');
    },
    async connect({commit, dispatch, getters}) {
      const token = getToken();
      if (!token) {
        console.error('socket::error connecting - no token exists');
        return;
      }
      socket = io.connect(`${API_URL}?token=${token}`);
      return new Promise((resolve, reject) => {
        socket.on('connection-ack', (msg: Record<string, any>) => {
          if (msg.err) {
            reject();
          }
          resolve();
        });

        socket.on('chat', (payload: {
          chat: IChat,
          session: ISession,
        }) => {
          const chats = getters.chats[payload.session.sessionId];
          // New session handling
          if (!chats) {
            commit('addSession', payload.session);
            // do not add chat, since it's a new session and we're going to be fetching the chats
            return;
          } else {
            commit('markSessionAsUnread', payload.session.sessionId);
            if (!chats.fetched) {
              return;
            }
          }

          commit('addChat', payload);
        });

        // socket.on('readChat', (sessionId: string) => {
        // });

        socket.on('error', (err: string) => {
          // TODO: figure out why ServerSocketError is undefined
          if (err === 'invalid token') {
            dispatch('logout');
            router.push({name: 'login'});
          }
        });
      });
    },
    async disconnect() {
      socket.disconnect();
    }
  },
});

/**
 * Attaches necessary properties to socket emit payloads
 * @param event
 * @param payload
 * @param cb
 */
async function emit(event: string, payload: Record<string, any>, cb?: Function) {
  if (!socket) {
    await store.dispatch('connect');
  }

  socket.emit(event, {
    ...payload,
    token: getToken(),
  }, cb);
}

export default store;
