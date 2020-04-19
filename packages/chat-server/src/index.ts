import express from 'express';
import * as sockets from 'socket.io';
import cors from 'cors';

import logger from './utils/logger';

// routes
import session from './routes/session';
import chat from './routes/chat';
import user from './routes/user';

// operation
import {newChat} from './shared/chat';
import {getSessions} from './shared/session';

// interfaces
import aws from 'aws-sdk';

const PORT = process.env.PORT || 8000;

const app = express();

interface IConnectedUsers {
  [key:string]: sockets.Socket;
}

interface IConnectedSockets {
  [key:string]: User;
}

type User = string;

const connectedUsers: IConnectedUsers = {}; // access socket object that corresponds to a connected user
const connectedSockets: IConnectedSockets = {}; // access user that socket corresponds to

app.use(logger);
app.use(cors());

app.use('/sessions', session);
app.use('/chats', chat);
app.use('/users', user);

const server = app.listen(PORT, () => {
  console.log('server listening on 8000');
});

const io = sockets.listen(server);
io.on('connection', function(socket) {
  const userId = socket.handshake.query.user_id;
  connectedSockets[socket.id] = userId;
  connectedUsers[userId] = socket;

  console.log(`user ${userId} connected`);

  socket.emit('ack', { msg: 'connected to server' });

  socket.on('chat', async ({message, session}) => {
    // add message to database
    await newChat(session, message);
    // send to connected user if they are connected
    const users: aws.DynamoDB.DocumentClient.QueryOutput = await getSessions(session);
    users.Items?.forEach((item: Record<string, any>) => {
      const socket = connectedUsers[item['user-id']];
      if (socket) {
        socket.emit('chat', {
          message,
          session
        });
      }
    })
  });

  socket.on('disconnect', () => {
    const disconnectedUserId = connectedSockets[socket.id];
    delete connectedUsers[disconnectedUserId];
    delete connectedSockets[socket.id];
    console.log(`user ${disconnectedUserId} disconnected`);
  });
});

(function logConnections() {
  setTimeout(() => {
    console.log('Connected sockets:');
    console.log(connectedSockets);
    console.log('Connected users:');
    console.log(Object.keys(connectedUsers));
    logConnections();
  }, 1000);
})();

