import { ISession, Session } from '@chat/shared';

import query from '../db/query';

export async function getSessions(sessionId: string): Promise<ISession[]> {
  const params = {
    TableName: 'session',
    KeyConditionExpression: '#s = :s',
    ExpressionAttributeValues: {
      ':s': `${sessionId}`,
    },
    ExpressionAttributeNames: {
      '#s': 'session-id',
    },
  };

  const res = await query(params);
  return res.map((session) => {
    return new Session(session['session-id'] as string, session.type as string, session['user-id'] as string, []);
  });
}
