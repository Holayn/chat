import {IUser} from '@chat/shared';
import {API_URL} from '../shared';

export async function getUserByUsername(username: string): Promise<IUser | null> {
  if (!username) {
    return {} as IUser;
  }
  const res: IUser = await (await fetch(`${API_URL}/users/findByUsername?username=${username}`)).json();
  if (!res.name) {
    return null;
  }
  return res;
}

export async function getUserById(userId: string): Promise<IUser> {
  if (!userId) {
    return {} as IUser;
  }
  const res = await fetch(`${API_URL}/users?user_id=${userId}`);
  return await res.json();
}
