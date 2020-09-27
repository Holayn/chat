import express from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import query from '../db/query';
import { createJwt, validateJwtMiddleware } from '../utils/jwt';

dotenv.config();

const router = express.Router();

router.get('/', async (req: any, res: express.Response) => {
  if (!req.query.username || !req.query.pass) {
    res.sendStatus(400);
  }
  try {
    const user = (await getAllUserInfo(req.query.username)) as Record<
      string,
      string
    >;
    const isMatch = await bcrypt.compare(req.query.pass, user.pass as string);
    if (isMatch) {
      const jwt = createJwt(user);
      res.cookie('token', jwt);
      res.send({
        token: jwt
      });
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/verify', validateJwtMiddleware(), async (req: any, res: any) => {
  res.sendStatus(200);
});

async function getAllUserInfo(username: string) {
  const params = {
    TableName: 'user',
    IndexName: 'username-index',
    KeyConditionExpression: '#u = :u',
    ExpressionAttributeValues: {
      ':u': `${username}`
    },
    ExpressionAttributeNames: {
      '#u': 'username'
    }
  };

  try {
    return (await query(params))[0];
  } catch (e) {
    throw e;
  }
}

export default router;
