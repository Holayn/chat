import express from 'express';
import get from '../db/get';
import query from '../db/query';
import { Session } from '@chat/shared';
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

export async function getUserSessions(userId: string): Promise<Session[]> {
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
      for (let i = 0; i < allSessions.length; i++) {
        const allSession = allSessions[i];
        if (!session.users) {
          session.users = [];
        }
        if (allSession['user-id'] !== userId) {
          session.users.push(await getUser(allSession['user-id'] as string));
        }
      }
      return new Session(session['session-id'], session.type, session['user-id'], session.users);
    }) ?? [Promise.reject()]);
    return retVal;
  } catch (e) {
    throw e;
  }
}

async function getUser(userId: string): Promise<User> {
  const params = {
    TableName: 'user',
    Key: {
      'user-id': `${userId}`,
    },
  };

  try {
    const res = await get(params);
    return new User(res.name as string, res['user-id'] as string, res.username as string);
  } catch (e) {
    throw e;
  }
}

export default router;
