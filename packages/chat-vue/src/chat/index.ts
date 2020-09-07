import {IChat} from '@chat/shared';
import {get} from '../utils/fetch';

export async function fetchChats(sessionId: string): Promise<IChat[]> {
  const chats = await get(`chats?session_id=${sessionId}`);
  return chats as IChat[];
}
