import {IChat} from '@chat/shared';
import {API_URL} from '../shared';

export async function getChats(sessionId: string): Promise<IChat[]> {
  const chats = await (await fetch(`${API_URL}/chats?session_id=${sessionId}`)).json();
  return chats as IChat[];
}

export async function sendChat(chat: IChat) {
  return await fetch(
    `${API_URL}/chats/new?session_id=${chat.sessionId}&message=${chat.message}&userId=${chat.userId}`,
    {
      method: 'POST',
    },
  );
}
