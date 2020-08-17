import {ISession} from '@chat/shared';
import {API_URL} from '../shared';

export async function getSessions(userId: string): Promise<ISession> {
  return await (await fetch(`${API_URL}/users/sessions?user_id=${userId}`)).json();
}
