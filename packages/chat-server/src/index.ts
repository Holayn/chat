import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import https from 'https';
import fs from 'fs';
import * as sockets from 'socket.io';
import swagger from 'swagger-ui-express';

import logger from './utils/logger';
import { sockets as socketsHandler } from './sockets/index';

// routes
import session from './routes/session';
import chat from './routes/chat';
import user from './routes/user';
import login from './routes/login';
import { handleAuthError } from './utils/jwt';
// import swaggerFile from '../swagger.json';

const PORT = process.env.PORT || 8000;

const app = express();

app.use(logger);
app.use(express.json());
app.use(helmet());
app.use(cors());
// app.use('/api-docs', swagger.serve, swagger.setup());

app.use('/sessions', session);
app.use('/chats', chat);
app.use('/users', user);
app.use('/login', login);

app.use(handleAuthError());

app.get('/health-check', (req, res) => res.sendStatus(200));

const server = https
  .createServer(
    {
      key: fs.readFileSync('ssl-cert/server.key'),
      cert: fs.readFileSync('ssl-cert/server.cert')
    },
    app
  )
  .listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
  });

const io = sockets.listen(server);
socketsHandler(io);
