import express from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

import query from '../db/query';
import put from '../db/put';
import scan from '../db/scan';
import { User } from '@chat/shared';

import { getUserSessions } from '../shared/session';
import { getUser } from '../shared/user';
import { validateJwtMiddleware } from '../utils/jwt';

const router = express.Router();

router.get('/', validateJwtMiddleware(), async (req: any, res: any) => {
  if (req.user.userId !== req.query.user_id) {
    res.sendStatus(403);
    return;
  }
  try {
    res.send(await getUser(req.query.user_id));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/sessions', validateJwtMiddleware(), async (req: any, res: any) => {
  if (req.user.userId !== req.query.user_id) {
    res.sendStatus(403);
    return;
  }
  try {
    res.send(await getUserSessions(req.query.user_id));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get(
  '/findByUsername',
  validateJwtMiddleware(),
  async (req: any, res: any) => {
    if (!req.query.username) {
      res.sendStatus(400);
      return;
    }

    const params = {
      TableName: 'user',
      IndexName: 'username-index',
      KeyConditionExpression: '#u = :u',
      ExpressionAttributeValues: {
        ':u': `${req.query.username}`
      },
      ExpressionAttributeNames: {
        '#u': 'username'
      }
    };

    try {
      const result = (await query(params))?.[0];
      if (!result) {
        res.send({
          message: 'no user found'
        });
      }
      res.send(
        new User(
          result.name as string,
          result['user-id'] as string,
          result.username as string
        )
      );
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }
);

router.post('/createAccount', async (req: any, res: any) => {
  if (
    !req.body.username ||
    !req.body.password ||
    !req.body.email ||
    !req.body.name
  ) {
    res.sendStatus(400);
    return;
  }

  const { username, password, email, name } = req.body;

  // verify email and username not taken
  const params = {
    TableName: 'user',
    FilterExpression: 'email = :email OR username = :username',
    ExpressionAttributeValues: {
      ':email': email,
      ':username': username
    }
  };

  try {
    const result = await scan(params);
    if (result.length) {
      res.sendStatus(409);
      return;
    }

    // TODO: verify email is valid by sending it an email
    const newAccountParams = {
      TableName: 'user',
      Item: {
        'user-id': uuid(),
        username,
        pass: bcrypt.hashSync(password, 6),
        email,
        name
      }
    };

    await put(newAccountParams);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export default router;
