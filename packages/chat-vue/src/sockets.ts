import {default as io, Socket as SocketIo} from 'socket.io-client';

import {IChat} from '@chat/shared';

import router from './router';
import {API_URL} from './shared';
import store from './store';
import {getToken} from './utils/auth';
import {getSession} from './session';

export class Socket {
  private static socket: typeof SocketIo;

  public static async connect() {
    const token = getToken();
    if (!token) {
      console.error('socket::error connecting - no token exists');
      return;
    }
    this.socket = io.connect(`${API_URL}?token=${token}`);
    return new Promise((resolve, reject) => {
      this.socket.on('connection-ack', (msg: Record<string, any>) => {
        if (msg.err) {
          reject();
        }
        resolve();
      });

      this.socket.on('chat', async (payload: {
        chat: IChat,
        sessionId: string,
      }) => {
        const chats = store.getters.chats[payload.sessionId];
        if (!chats) {
          // New session handling
          const fetchedSession = await getSession(payload.sessionId);
          store.commit('addSession', fetchedSession);
          // do not add chat, since it's a new seession and we're going to be fetching the chats
          return;
        } else {
          store.commit('markSessionAsUnread', payload.sessionId);
          if (!chats.fetched) {
            return;
          }
        }

        store.commit('addChat', payload);
      });

      // socket.on('readChat', (sessionId: string) => {
      // });

      this.socket.on('error', (err: string) => {
        // TODO: figure out why ServerSocketError is undefined
        if (err === 'invalid token') {
          store.dispatch('logout');
          router.push({name: 'login'});
        }
      });
    });
  }

  public static async disconnect() {
    this.socket.disconnect();
  }

  /**
   * Attaches necessary properties to socket emit payloads
   * @param event
   * @param payload
   * @param cb
   */
  public static async emit(event: string, payload: Record<string, any>, cb?: () => void) {
    if (!this.socket) {
      await this.connect();
    }

    this.socket.emit(event, {
      ...payload,
      token: getToken(),
    }, cb);
  }
}
