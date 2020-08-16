import {API_URL} from '../shared';
import {IUser} from '../user';

export interface ISession {
  'session-id': number;
  type: string;
  'user-id': string;
  users: IUser[];
}

export async function getSessions(userId: string): Promise<ISession> {
  const res = await fetch(`${API_URL}/users/sessions?user_id=${userId}`);
  return await res.json();
}
