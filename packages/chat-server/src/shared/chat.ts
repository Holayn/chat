import { v4 as uuid } from 'uuid';
import put from '../db/put';

export function newChat(sessionId: string, message: string, userId: string) {
  return put(newChatParams(sessionId, message, userId));
}

function newChatParams(sessionId: string, message: string, userId: string) {
  return {
    TableName: 'chat',
    Item: {
      message,
      'session-id': sessionId, // generate a unique session id
      'user-id': userId,
      timestamp: `${Date.now()}`,
      'chat-id': uuid(),
      type: 'text',
    },
  };
}
