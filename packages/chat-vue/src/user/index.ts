import {API_URL} from '../shared';

export interface IUser {
  name: string;
  'user-id': string;
  username: string;
}

export async function getUserByUsername(username: string): Promise<IUser> {
  if (!username) {
    return {} as IUser;
  }
  const res = await fetch(`${API_URL}/users/findByUsername?username=${username}`);
  const user: IUser = (await res.json());

  return user;
}

export async function getUserById(userId: string): Promise<IUser> {
  if (!userId) {
    return {} as IUser;
  }
  const res = await fetch(`${API_URL}/users?user_id=${userId}`);
  const user = (await res.json());

  return user;
}
