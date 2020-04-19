import query from '../db/query';

export function getSessions(sessionId: string) {
  const params = {
    TableName: 'session',
    KeyConditionExpression: '#s = :s',
    ExpressionAttributeValues: {
      ':s': `${sessionId}`,
    },
    ExpressionAttributeNames: {
      '#s': 'session-id'
    }
  }

  return query(params);
}