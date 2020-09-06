import express from 'express';
import { Chat } from '@chat/shared';

import query from '../db/query';
import { newChat } from '../shared/chat';

const router = express.Router();

router.get('/', async (req: any, res: any) => {
  const params = {
    TableName: 'chat',
    KeyConditionExpression: '#s = :s',
    ExpressionAttributeValues: {
      ':s': `${req.query.session_id}`,
    },
    ExpressionAttributeNames: {
      '#s': 'session-id',
    },
  };

  try {
    res.send((await query(params)).map((chat) => {
      return new Chat(chat['chat-id'] as string, chat['session-id'] as string, chat['user-id'] as string, chat.message as string, parseInt(chat.timestamp as string, 10));
    }));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/new', async (req: any, res: any) => {
  if (!req.query.session_id || !req.query.message || !req.query.userId) {
    res.sendStatus(422);
  }
  try {
    const chat = Chat.createChat(req.query.session_id, req.query.message, req.query.userId);
    await newChat(chat);
    res.send('success');
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export default router;
