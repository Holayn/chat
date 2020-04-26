import { v4 } from 'uuid';
import put from '../db/put';

export function newChat(sessionId: string, message: string, userId: string) {
  return put(newChatParams(sessionId, message, userId));
}

function newChatParams(sessionId: string, message: string, userId: string) {
  return {
    TableName: 'chat-v3',
    Item: {
      message,
      'session-id': sessionId, // generate a unique session id
      'user-id': userId,
      'timestamp_chat-id': `${Date.now()}_${v4()}`,
      type: 'text',
    },
  };
}
