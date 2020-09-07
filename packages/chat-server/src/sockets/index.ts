import * as socket from 'socket.io';
import {IChat, ISession, Session} from '@chat/shared';

// operations
import { newChat } from '../shared/chat';
import { sessionExists, newSession, fetchSessionUsers } from '../shared/session';

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

    // TODO: secure this
    socket.on('chat', async ({chat, session}: {chat: IChat, session: ISession}) => {
      // check if session exists in database, create new sessions if not
      if (!await sessionExists(session.sessionId)) {
        await newSession(session.sessionId, session.userId, session.users[0].userId);
      }
      // add message to database
      await newChat(chat);
      // send to connected user if they are connected
      const userId = session.users[0].userId;
      const socket = connectedUsers[userId];
      if (socket) {
        // send the session that belongs to that user
        const users = await fetchSessionUsers(session.sessionId, userId);
        socket.emit('chat', {chat, session: new Session(session.sessionId, session.type, userId, users)});
      }
    });

    socket.on('disconnect', () => {
      const disconnectedUserId = connectedSockets[socket.id];
      delete connectedUsers[disconnectedUserId];
      delete connectedSockets[socket.id];
      console.log(`user ${disconnectedUserId} disconnected`);
      logConnections();
    });

    console.log(`user ${userId} connected`);
    logConnections();
    socket.emit('ack', { msg: 'connected to server' });
  });
}

function logConnections() {
  console.log('Connected sockets:');
  console.log(connectedSockets);
  console.log('Connected users:');
  console.log(Object.keys(connectedUsers));
}
