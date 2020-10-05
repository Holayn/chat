import { default as socketIO, Socket } from 'socket.io';
import { IChat, ISession, ServerSocketError } from '@chat/shared';

import { newChat } from '../shared/chat';
import {
  sessionExists,
  newSessions,
  updateSession
} from '../shared/session';
import { verifyJwt } from '../utils/jwt';

interface IConnectedUsers {
  [key: string]: socketIO.Socket;
}

interface IConnectedSockets {
  [key: string]: User;
}

type User = string;

const connectedUsers: IConnectedUsers = {}; // access socket object that corresponds to a connected user
const connectedSockets: IConnectedSockets = {}; // access user that socket corresponds to

export function sockets(io: socketIO.Server) {
  io.on('connection', (socket: Socket) => {
    socket.use(validateJwtSocketMiddleware);

    // Verify the token passed was correct
    const token = socket.handshake.query.token;
    const decoded = verifyJwt(token);
    if (!decoded) {
      socket.emit('connection-ack', {
        err: ServerSocketError.ConnectionInvalidToken
      });
      return;
    }

    const userId = decoded.userId;
    connectedSockets[socket.id] = userId;
    connectedUsers[userId] = socket;

    socket.on(
      'chat',
      async (
        { chat, session }: { chat: IChat; session: ISession },
        ack: () => void
      ) => {
        // check if session exists in database, create new sessions if not
        // TODO: cache this
        if (!(await sessionExists(session.sessionId))) {
          await newSessions(
            session.sessionId,
            session.userId,
            session.users[0].userId
          );
        }
        // add message to database
        await newChat(chat);
        // send to connected user if they are connected
        const otherUserId = session.users[0].userId;
        const otherUserSocket = connectedUsers[otherUserId];
        if (otherUserSocket) {
          otherUserSocket.emit('chat', {
            chat,
            sessionId: session.sessionId,
          });

          // the session is now unread for the user being sent a message
          await updateSession(session.sessionId, userId, {
            read: false
          });
        }

        ack();
      }
    );

    socket.on('readChat', async ({ sessionId, userId }: { sessionId: string, userId: string }) => {
      if (await sessionExists(sessionId)) {
        await updateSession(sessionId, userId, {
          read: true
        });
      }

      // TODO: let connected user know that the session has been read
      // const socket = connectedUsers[userId];
      // if (socket) {
      //   socket.emit('readChat', session.sessionId);
      // }
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
    socket.emit('connection-ack', { msg: 'connected to server' });
  });
}

export function validateJwtSocketMiddleware(
  packet: socketIO.Packet,
  next: (err?: any) => void
) {
  const token = packet[1].token;
  const decoded = verifyJwt(token);
  if (!decoded) {
    next(new Error(ServerSocketError.InvalidToken));
    return;
  }
  next();
}

function logConnections() {
  console.log('Connected sockets:');
  console.log(connectedSockets);
  console.log('Connected users:');
  console.log(Object.keys(connectedUsers));
}
