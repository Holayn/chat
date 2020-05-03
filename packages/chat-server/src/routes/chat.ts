import express from 'express';

import query from '../db/query';
import { newChat } from '../shared/chat';

const router = express.Router();

router.get('/', async (req, res) => {
  const params = {
    TableName: 'chat-v3',
    KeyConditionExpression: '#s = :s',
    ExpressionAttributeValues: {
      ':s': `${req.query.session_id}`,
    },
    ExpressionAttributeNames: {
      '#s': 'session-id',
    },
  };

  try {
    res.send((await query(params)).Items);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/new', async (req, res) => {
  if (!req.query.session_id || !req.query.message || !req.query.userId) {
    res.sendStatus(422);
  }
  try {
    await newChat(req.query.session_id as string, req.query.message as string, req.query.userId as string);
    res.send('success');
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export default router;
