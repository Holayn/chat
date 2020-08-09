import {API_URL} from '../shared';

export interface IChat {
  "chat-id": string;
  "session-id": string;
  "user-id": string;
  message: string;
  timestamp: string;
}

export async function getChats(sessionId: string): Promise<IChat> {
  return await (await fetch(`${API_URL}/chats?session_id=${sessionId}`)).json();
}
