import * as socket from 'socket.io';

// operations
import { newChat } from '../shared/chat';
import { getSessions } from '../shared/session';

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

    socket.on('chat', async ({ message, session }: {message: string, session: string}) => {
      // add message to database
      await newChat(session, message, userId);
      // send to connected user if they are connected
      const users = await getSessions(session);
      users?.forEach((item: Record<string, any>) => {
        const socket = connectedUsers[item['user-id']];
        if (socket) {
          socket.emit('chat', {
            message,
            session,
          });
        }
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
