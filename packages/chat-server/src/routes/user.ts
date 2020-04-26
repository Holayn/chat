import express from 'express';
import get from '../db/get';
import query from '../db/query';

const router = express.Router();

router.get('/sessions', async (req: any, res: any) => {
  const userId = req.query.user_id;
  const params = {
    TableName: 'session',
    IndexName:'user-id-index',
    KeyConditionExpression: '#u = :u',
    ExpressionAttributeValues: {
      ':u': `${userId}`,
    },
    ExpressionAttributeNames: {
      '#u': 'user-id',
    },
  };

  try {
    const sessions = (await query(params)).Items;

    // populate session objects with the user-id(s) associated with them
    // execute DB fetches in parallel
    const retVal = await Promise.all(sessions?.map(async (session: any) => {
      const paramsAllSessionEntries = {
        TableName: 'session',
        KeyConditionExpression: '#s = :s',
        ExpressionAttributeValues: {
          ':s': `${session['session-id']}`,
        },
        ExpressionAttributeNames: {
          '#s': 'session-id',
        },
      };
      const allSessions = (await query(paramsAllSessionEntries)).Items;
      allSessions?.forEach((allSession) => {
        if (!session.users) {
          session.users = [];
        }
        if (allSession['user-id'] !== userId) {
          session.users.push(allSession['user-id']);
        }
      });
      return session;
    }) ?? [Promise.reject()]);
    res.send(retVal);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/', async (req: any, res: any) => {
  const params = {
    TableName: 'user',
    Key: {
      'user-id': `${req.query.user_id}`,
    },
  };

  try {
    res.send(await get(params));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/findByUsername', async (req: any, res: any) => {
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
    res.send((await query(params)).Items?.[0]);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export default router;
