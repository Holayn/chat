import {default as socket, Socket} from 'socket.io';
import {IChat, ISession, Session, ServerSocketError} from '@chat/shared';

// operations
import { newChat } from '../shared/chat';
import { sessionExists, newSessions, fetchSessionUsers, updateSession } from '../shared/session';
import {verifyJwt} from '../utils/jwt';

interface IConnectedUsers {
  [key:string]: socket.Socket;
}

interface IConnectedSockets {
  [key:string]: User;
}

type User = string;

const connectedUsers: IConnectedUsers = {}; // access socket object that corresponds to a connected user
const connectedSockets: IConnectedSockets = {}; // access user that socket corresponds to

export function sockets(io: socket.Server) {
  io.on('connection', (socket: Socket) => {
    socket.use(validateJwtSocketMiddleware);

    // Verify the token passed was correct
    const token = socket.handshake.query.token;
    const decoded = verifyJwt(token);
    if (!decoded) {
      socket.emit('connection-ack', {err: ServerSocketError.ConnectionInvalidToken});
      return;
    }

    const userId = decoded.userId;
    connectedSockets[socket.id] = userId;
    connectedUsers[userId] = socket;

    // TODO: secure this
    socket.on('chat', async ({chat, session}: {chat: IChat, session: ISession}, ack: Function) => {
      // check if session exists in database, create new sessions if not
      if (!await sessionExists(session.sessionId)) {
        await newSessions(session.sessionId, session.userId, session.users[0].userId);
      }
      // add message to database
      await newChat(chat);
      // send to connected user if they are connected
      const userId = session.users[0].userId;
      const socket = connectedUsers[userId];
      if (socket) {
        // send the session that belongs to that user
        // TODO: improve the logic here - this fetch isn't necessary
        const users = await fetchSessionUsers(session.sessionId, userId);
        socket.emit('chat', {chat, session: new Session(session.sessionId, session.type, userId, users, false)});

        // the session is now unread for the user being sent a message
        await updateSession(session.sessionId, userId, {
          read: false,
        });
      }

      ack();
    });

    socket.on('readChat', async ({session}: {session: ISession}) => {
      if (await sessionExists(session.sessionId)) {
        await updateSession(session.sessionId, session.userId, {
          read: true,
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

export function validateJwtSocketMiddleware(packet: socket.Packet, next: (err?: any) => void) {
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
