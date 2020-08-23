import { Session } from '@chat/shared';

import query from '../db/query';
import {getUser} from './user';

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
