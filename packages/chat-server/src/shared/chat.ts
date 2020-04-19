import {v4} from 'uuid';
import put from '../db/put';

export function newChat(sessionId: string, message: string) {
  return put(newChatParams(sessionId, message));
}

function newChatParams(sessionId: string, message: string) {
  return {
    TableName: 'chat',
    Item: {
      'session-id': sessionId, // generate a unique session id
      'chat-id': v4(),
      'message': message,
      'timestamp': Date.now(),
      'type': 'text',
    }
  }
}
