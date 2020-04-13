import express from 'express';
import {v4} from 'uuid';

import query from '../db/query';
import put from '../db/put';

const router = express.Router();

router.get('/', async (req: any, res: any) => {
  const params = {
    TableName: 'session',
    KeyConditionExpression: '#s = :s',
    ExpressionAttributeValues: {
      ':s': `${req.query.session_id}`,
    },
    ExpressionAttributeNames: {
      '#s': 'session-id'
    }
  }

  try {
    res.send(await query(params));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/new', async (req: any, res: any) => {
  if (!req.query.user_id_1 || !req.query.user_id_2) {
    return;
  }
  try {
    await put(newSessionParams(req.query.user_id_1));
    await put(newSessionParams(req.query.user_id_2));
    res.send('success');
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

function newSessionParams(user: string) {
  return {
    TableName: 'session',
    Item: {
      'session-id': v4(), // generate a unique session id
      'user-id': user,
      'type': 'regular',
    }
  }
}

export default router;
