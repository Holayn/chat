import express from 'express';
import cors from 'cors';
import * as sockets from 'socket.io';
import swagger from 'swagger-ui-express';

import logger from './utils/logger';
import {sockets as socketsHandler} from './sockets/index';

// routes
import session from './routes/session';
import chat from './routes/chat';
import user from './routes/user';

const PORT = process.env.PORT || 8000;

const app = express();

app.use(logger);
app.use(cors());
app.use('/api-docs', swagger.serve, swagger.setup(require('../swagger.json')));

app.use('/sessions', session);
app.use('/chats', chat);
app.use('/users', user);

const server = app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});

const io = sockets.listen(server);
socketsHandler(io);
