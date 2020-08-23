import express from 'express';
import query from '../db/query';
import {getUser} from '../shared/user';
import {getUserSessions} from '../shared/session';
import { User } from '@chat/shared';

const router = express.Router();

router.get('/sessions', async (req: any, res: any) => {
  try {
    res.send(await getUserSessions(req.query.user_id));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/', async (req: any, res: any) => {
  try {
    res.send(await getUser(req.query.user_id));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/findByUsername', async (req: any, res: any) => {
  if (!req.query.username) {
    res.sendStatus(400);
    return;
  }

  const params = {
    TableName: 'user',
    IndexName:'username-index',
    KeyConditionExpression: '#u = :u',
    ExpressionAttributeValues: {
      ':u': `${req.query.username}`,
    },
    ExpressionAttributeNames: {
      '#u': 'username',
    },
  };

  try {
    const result = (await query(params))?.[0];
    res.send(new User(result.name as string, result['user-id'] as string, result.username as string));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export default router;
