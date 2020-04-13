import express from 'express';
import {v4} from 'uuid';

import query from '../db/query';
import put from '../db/put';

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
    await put(newSessionParams(req.query.session_id, req.query.message));
    res.send('success');
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

function newSessionParams(sessionId: string, message: string) {
  return {
    TableName: 'chat',
    Item: {
      'session-id': sessionId, // generate a unique session id
      'chat-id': v4(),
      'message': message,
      'timestamp': Date.now(),
      'type': 'text',
    }
  }
}

export default router;
