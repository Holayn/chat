import express from 'express';

// routes
import session from './routes/session';
import chat from './routes/chat';

const PORT = process.env.PORT || 8000;

const server = express();
server.listen(PORT, () => {
  console.log('server listening on 8000');
});

server.use('/session', session);
server.use('/chat', chat);
