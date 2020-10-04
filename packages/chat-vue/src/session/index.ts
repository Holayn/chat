import {ISession} from '@chat/shared';
import {get} from '../utils/fetch';

export async function getSessions(userId: string) {
  return await get<ISession[]>(`users/sessions?user_id=${userId}`);
}

export async function getSession(sessionId: string) {
  return await get<ISession>(`sessions/session?session_id=${sessionId}`);
}
