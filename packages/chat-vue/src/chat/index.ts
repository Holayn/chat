import {IChat} from '@chat/shared';
import {API_URL} from '../shared';

export async function fetchChats(sessionId: string): Promise<IChat[]> {
  const chats = await (await fetch(`${API_URL}/chats?session_id=${sessionId}`)).json();
  return chats as IChat[];
}
