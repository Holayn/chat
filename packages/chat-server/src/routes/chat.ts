import express from 'express';
import { Chat } from '@chat/shared';

import query from '../db/query';
import { newChat } from '../shared/chat';
import { getUserIdsInSession, sessionExists } from '../shared/session';
import { validateJwtMiddleware } from '../utils/jwt';

const router = express.Router();

router.get('/', validateJwtMiddleware(), async (req: any, res: any) => {
  if (!req.query.session_id) {
    res.sendStatus(400);
    return;
  }
  if (!(await sessionExists(req.query.session_id))) {
    res.send([]);
  }
  const userIds = await getUserIdsInSession(req.query.session_id);
  if (!userIds.has(req.user.userId)) {
    res.sendStatus(403);
    return;
  }

  const params = {
    TableName: 'chat',
    KeyConditionExpression: '#s = :s',
    ExpressionAttributeValues: {
      ':s': `${req.query.session_id}`
    },
    ExpressionAttributeNames: {
      '#s': 'session-id'
    }
  };

  try {
    res.send(
      (await query(params)).map(chat => {
        return new Chat(
          chat['chat-id'] as string,
          chat['session-id'] as string,
          chat['user-id'] as string,
          chat.message as string,
          parseInt(chat.timestamp as string, 10)
        );
      })
    );
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/new', validateJwtMiddleware(), async (req: any, res: any) => {
  if (!req.query.session_id || !req.query.message || !req.query.userId) {
    res.sendStatus(400);
    return;
  }
  if (req.query.userId !== req.user.userId) {
    res.sendStatus(403);
    return;
  }
  // only allow users to add chat to a session they're in
  const userIds = await getUserIdsInSession(req.query.session_id);
  if (!userIds.has(req.user.userId)) {
    res.sendStatus(403);
    return;
  }

  try {
    const chat = Chat.createChat(
      req.query.session_id,
      req.query.message,
      req.query.userId
    );
    await newChat(chat);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export default router;
