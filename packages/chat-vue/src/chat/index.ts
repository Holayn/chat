import {IChat} from '@chat/shared';
import {get} from '../utils/fetch';

export async function getChats(sessionId: string) {
  return await get<IChat[]>(`chats?session_id=${sessionId}`);
}
