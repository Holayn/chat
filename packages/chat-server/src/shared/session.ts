import { Session } from '@chat/shared';

import query from '../db/query';
import {getUser} from './user';

import put from '../db/put';
import update from '../db/update';

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
      const users = await fetchSessionUsers(session['session-id'], userId);
      return new Session(session['session-id'], session.type, session['user-id'], users, session.read);
    }) ?? [Promise.reject()]);
    return retVal;
  } catch (e) {
    throw e;
  }
}

export async function fetchSessionUsers(sessionId: string, userId: string) {
  const users = [];
  const paramsAllSessionEntries = {
    TableName: 'session',
    KeyConditionExpression: '#s = :s',
    ExpressionAttributeValues: {
      ':s': `${sessionId}`,
    },
    ExpressionAttributeNames: {
      '#s': 'session-id',
    },
  };
  const allSessions = (await query(paramsAllSessionEntries) ?? []);
  for (let i = 0; i < allSessions.length; i++) {
    const allSession = allSessions[i];
    if (allSession['user-id'] !== userId) {
      users.push(await getUser(allSession['user-id'] as string));
    }
  }
  return users;
}

export async function getUserIdsInSession(sessionId: string): Promise<string[]> {
  const paramsAllSessionEntries = {
    TableName: 'session',
    KeyConditionExpression: '#s = :s',
    ExpressionAttributeValues: {
      ':s': `${sessionId}`,
    },
    ExpressionAttributeNames: {
      '#s': 'session-id',
    },
  };
  const allSessions = (await query(paramsAllSessionEntries) ?? []);
  const set: Record<string, any> = {};
  allSessions.forEach((session) => {
    set[session['user-id'] as string] = null;
  });
  return Object.keys(set);
}

export async function sessionExists(sessionId: string): Promise<boolean> {
  const paramsAllSessionEntries = {
    TableName: 'session',
    KeyConditionExpression: '#s = :s',
    ExpressionAttributeValues: {
      ':s': `${sessionId}`,
    },
    ExpressionAttributeNames: {
      '#s': 'session-id',
    },
  };
  const allSessions = (await query(paramsAllSessionEntries) ?? []);
  return !!allSessions.length;
}

export async function newSession(sessionId: string, userId: string, otherUserId: string) {
  await put(newSessionParams(sessionId, userId));
  await put(newSessionParams(sessionId, otherUserId));
}

function newSessionParams(sessionId: string, user: string) {
  return {
    TableName: 'session',
    Item: {
      'session-id': sessionId, // generate a unique session id
      'user-id': user,
      type: 'regular',
    },
  };
}

export async function checkSessions(userId: string, otherUserId: string) {
  if (!userId || !otherUserId) {
    throw new Error('validation failed');
  }
  try {
    const sessions = await getUserSessions(userId);
    for (let i = 0; i < sessions.length; i++) {
      if (sessions[i].users[0].userId === otherUserId) {
        return false;
      }
    }
    return true;
  } catch (e) {
    throw new Error(e);
  }
}

export async function updateSession(sessionId: string, userId: string, propertyValues: Record<string, any>) {
  const updateExpression = `set ` + Object.keys(propertyValues).reduce((acc, property) => {
    acc += `#${property} = :${property}, `;
    return acc;
  }, '').trim().slice(0, -1);
  const params = {
    TableName: 'session',
    Key: {
      'session-id': sessionId,
      'user-id': userId,
    },
    ExpressionAttributeValues: {
      ...Object.keys(propertyValues).reduce((acc, property) => {
        acc[`:${property}`] = propertyValues[property];
        return acc;
      }, {} as Record<string, any>),
    },
    ExpressionAttributeNames: {
      ...Object.keys(propertyValues).reduce((acc, property) => {
        acc[`#${property}`] = property;
        return acc;
      }, {} as Record<string, any>),
    },
    UpdateExpression: updateExpression,
  }

  await update(params);
}
