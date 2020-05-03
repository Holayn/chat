import express from 'express';
import get from '../db/get';
import query from '../db/query';

const router = express.Router();

router.get('/sessions', async (req: any, res: any) => {
  try {
    const data = await getUserSessions(req.query.user_id);
    res.send(data);
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
    res.send((await query(params))?.[0]);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export async function getUserSessions(userId: string) {
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
    const sessions = (await query(params));

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
      const allSessions = (await query(paramsAllSessionEntries) ?? []);
      for (let i=0; i<allSessions.length; i++) {
        const allSession = allSessions[i];
        if (!session.users) {
          session.users = [];
        }
        if (allSession['user-id'] !== userId) {
          session.users.push(await getUser(allSession['user-id'] as string));
        }
      }
      return session;
    }) ?? [Promise.reject()]);
    return retVal;
  } catch (e) {
    throw e;
  }
}

async function getUser(userId: string) {
  const params = {
    TableName: 'user',
    Key: {
      'user-id': `${userId}`,
    },
  };

  try {
    return await get(params);
  } catch (e) {
    throw e;
  }
}

export default router;
