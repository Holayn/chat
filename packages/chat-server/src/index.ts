import express from 'express';
import logger from './utils/logger';

// routes
import session from './routes/session';
import chat from './routes/chat';
import user from './routes/user';

const PORT = process.env.PORT || 8000;

const server = express();
server.listen(PORT, () => {
  console.log('server listening on 8000');
});

server.use(logger);

server.use('/sessions', session);
server.use('/chats', chat);
server.use('/users', user);
