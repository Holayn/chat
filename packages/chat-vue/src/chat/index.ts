import {API_URL} from '../shared';

export async function getChats(sessionId: string) {
  return await (await fetch(`${API_URL}/chats?session_id=${sessionId}`)).json();
}