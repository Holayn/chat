import { Session, IUser } from '@chat/shared';

import query from '../db/query';
import { getUser } from './user';

import put from '../db/put';
import update from '../db/update';

export async function getUserSessions(userId: string): Promise<Session[]> {
  const params = {
    TableName: 'session',
    IndexName: 'user-id-index',
    KeyConditionExpression: '#u = :u',
    ExpressionAttributeValues: {
      ':u': `${userId}`
    },
    ExpressionAttributeNames: {
      '#u': 'user-id'
    }
  };

  try {
    const sessions = await query(params);

    // populate session objects with the user-id(s) associated with them
    // execute DB fetches in parallel
    const retVal = await Promise.all(
      sessions?.map(async (session: any) => {
        const users = await fetchSessionUsers(session['session-id'], userId);
        return new Session(
          session['session-id'],
          session.type,
          session['user-id'],
          users,
          session.read
        );
      }) ?? [Promise.reject()]
    );
    return retVal;
  } catch (e) {
    throw e;
  }
}

export async function fetchSessions(sessionId: string) {
  const paramsAllSessionEntries = {
    TableName: 'session',
    KeyConditionExpression: '#s = :s',
    ExpressionAttributeValues: {
      ':s': `${sessionId}`
    },
    ExpressionAttributeNames: {
      '#s': 'session-id'
    }
  };
  return await query(paramsAllSessionEntries) ?? [];
}

export function getOtherUsersInSession(sessions: any[], userId: string): Promise<IUser[]> {
  return Promise.all(sessions.reduce((acc, session) => {
    if (session['user-id'] !== userId) {
      acc.push(getUser(session['user-id'] as string));
    }
    return acc;
  }, [] as Promise<IUser>[]));
}

export async function fetchSessionUsers(sessionId: string, userId: string) {
  const allSessions = await fetchSessions(sessionId);
  return getOtherUsersInSession(allSessions, userId);
}

export async function getUserIdsInSession(
  sessionId: string
): Promise<Set<string>> {
  const paramsAllSessionEntries = {
    TableName: 'session',
    KeyConditionExpression: '#s = :s',
    ExpressionAttributeValues: {
      ':s': `${sessionId}`
    },
    ExpressionAttributeNames: {
      '#s': 'session-id'
    }
  };
  const allSessions = (await query(paramsAllSessionEntries)) ?? [];
  const set = new Set<string>();
  allSessions.forEach(session => {
    set.add(session['user-id'] as string);
  });
  return set;
}

export async function sessionExists(sessionId: string): Promise<boolean> {
  const paramsAllSessionEntries = {
    TableName: 'session',
    KeyConditionExpression: '#s = :s',
    ExpressionAttributeValues: {
      ':s': `${sessionId}`
    },
    ExpressionAttributeNames: {
      '#s': 'session-id'
    }
  };
  const allSessions = (await query(paramsAllSessionEntries)) ?? [];
  return !!allSessions.length;
}

export async function newSessions(
  sessionId: string,
  userId: string,
  otherUserId: string
) {
  await put(newSessionParams(sessionId, userId));
  await put(newSessionParams(sessionId, otherUserId));
}

function newSessionParams(sessionId: string, user: string) {
  return {
    TableName: 'session',
    Item: {
      'session-id': sessionId, // generate a unique session id
      'user-id': user,
      type: 'regular'
    }
  };
}

export async function usersHaveSession(
  userId: string,
  otherUserId: string
) {
  if (!userId || !otherUserId) {
    throw new Error('validation failed');
  }
  const sessions = await getUserSessions(userId);
  return !sessions.every(session => {
    return session.users[0].userId !== otherUserId;
  });
}

export async function updateSession(
  sessionId: string,
  userId: string,
  propertyValues: Record<string, any>
) {
  const updateExpression =
    `set ` +
    Object.keys(propertyValues)
      .reduce((acc, property) => {
        acc += `#${property} = :${property}, `;
        return acc;
      }, '')
      .trim()
      .slice(0, -1);
  const params = {
    TableName: 'session',
    Key: {
      'session-id': sessionId,
      'user-id': userId
    },
    ExpressionAttributeValues: {
      ...Object.keys(propertyValues).reduce((acc, property) => {
        acc[`:${property}`] = propertyValues[property];
        return acc;
      }, Object.create(null))
    },
    ExpressionAttributeNames: {
      ...Object.keys(propertyValues).reduce((acc, property) => {
        acc[`#${property}`] = property;
        return acc;
      }, Object.create(null))
    },
    UpdateExpression: updateExpression
  };

  await update(params);
}
