import * as socket from 'socket.io';
import {IChat} from '@chat/shared';

// operations
import { newChat } from '../shared/chat';
import { getUserSessions } from '../shared/session';

interface IConnectedUsers {
  [key:string]: socket.Socket;
}

interface IConnectedSockets {
  [key:string]: User;
}

type User = string;

const connectedUsers: IConnectedUsers = {}; // access socket object that corresponds to a connected user
const connectedSockets: IConnectedSockets = {}; // access user that socket corresponds to

export function sockets(io: any) {
  io.on('connection', (socket: any) => {
    const userId = socket.handshake.query.user_id;
    connectedSockets[socket.id] = userId;
    connectedUsers[userId] = socket;

    socket.on('chat', async (chat: IChat) => {
      // add message to database
      await newChat(chat.sessionId, chat.message, chat.userId);
      // send to connected user if they are connected
      const sessions = await getUserSessions(chat.userId);
      sessions?.forEach((session) => {
        session.users.forEach((user) => {
          const socket = connectedUsers[user.userId];
          if (socket) {
            socket.emit('chat', chat);
          }
        });
      });
    });

    socket.on('disconnect', () => {
      const disconnectedUserId = connectedSockets[socket.id];
      delete connectedUsers[disconnectedUserId];
      delete connectedSockets[socket.id];
      console.log(`user ${disconnectedUserId} disconnected`);
    });

    console.log(`user ${userId} connected`);
    socket.emit('ack', { msg: 'connected to server' });
  });
}

(function logConnections() {
  setTimeout(() => {
    console.log('Connected sockets:');
    console.log(connectedSockets);
    console.log('Connected users:');
    console.log(Object.keys(connectedUsers));
    logConnections();
  },         1000);
})();
