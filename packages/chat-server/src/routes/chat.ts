import express from 'express';

import query from '../db/query';
import put from '../db/put';
import {newChat} from '../shared/chat';

const router = express.Router();

router.get('/', async (req: any, res: any) => {
  const params = {
    TableName: 'chat',
    KeyConditionExpression: '#s = :s',
    ExpressionAttributeValues: {
      ':s': `${req.query.session_id}`,
    },
    ExpressionAttributeNames: {
      '#s': 'session-id'
    }
  };

  try {
    res.send(await query(params));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/new', async (req: any, res: any) => {
  if (!req.query.session_id || !req.query.message) {
    return;
  }
  try {
    await newChat(req.query.session_id, req.query.message);
    res.send('success');
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export default router;
