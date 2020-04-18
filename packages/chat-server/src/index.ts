import express from 'express';
import * as sockets from 'socket.io';

import logger from './utils/logger';

// routes
import session from './routes/session';
import chat from './routes/chat';
import user from './routes/user';

const PORT = process.env.PORT || 8000;

const app = express();

app.use(logger);

app.use('/sessions', session);
app.use('/chats', chat);
app.use('/users', user);

const server = app.listen(PORT, () => {
  console.log('server listening on 8000');
});

const io = sockets.listen(server);
io.on('connection', function (socket) {
  console.log('client connected');
  socket.emit('ack', { msg: 'connected to server' });
});