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
