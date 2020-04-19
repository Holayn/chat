import express from 'express';
import * as sockets from 'socket.io';

import logger from './utils/logger';

// routes
import session from './routes/session';
import chat from './routes/chat';
import user from './routes/user';

const PORT = process.env.PORT || 8000;

const app = express();

interface IConnectedUsers {
  [key:string]: sockets.Socket;
}

interface IConnectedSockets {
  [key:string]: User;
}

type User = string;

const connectedUsers: IConnectedUsers = {};
const connectedSockets: IConnectedSockets = {};

app.use(logger);

app.use('/sessions', session);
app.use('/chats', chat);
app.use('/users', user);

const server = app.listen(PORT, () => {
  console.log('server listening on 8000');
});

const io = sockets.listen(server);
io.on('connection', function(socket) {
  console.log('client connected');
  console.log(socket.handshake.query);

  const userId = socket.handshake.query.userId;
  socket.emit('ack', { msg: 'connected to server' });
});

// io.on('disconnect', function(socket) {
  
// })
