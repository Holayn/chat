import { IChat } from '@chat/shared';
import put from '../db/put';

export function newChat(chat: IChat) {
  return put(newChatParams(chat));
}

function newChatParams(chat: IChat) {
  return {
    TableName: 'chat',
    Item: {
      message: chat.message,
      'session-id': chat.sessionId, // generate a unique session id
      'user-id': chat.userId,
      timestamp: `${chat.timestamp}`,
      'chat-id': chat.chatId,
      type: 'text',
    },
  };
}
