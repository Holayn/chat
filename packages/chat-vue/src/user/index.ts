import {IUser} from '@chat/shared';

import {get, post} from '../utils/fetch';
import {RequestError} from '../shared/errors';

export async function getUserByUsername(username: string): Promise<IUser | null> {
  if (!username) {
    return {} as IUser;
  }
  const res: IUser = await get(`users/findByUsername?username=${username}`);
  if (!res.userId) {
    return null;
  }
  return res;
}

export async function getUserById(userId: string): Promise<IUser | null> {
  if (!userId) {
    return {} as IUser;
  }
  const res: IUser = await get(`users?user_id=${userId}`);
  if (!res.name) {
    return null;
  }
  return res;
}

export async function login(username: string, password: string): Promise<string|null> {
  try {
    const res = await get(`login?username=${username}&pass=${password}`, false);
    return res.token;
  } catch (e) {
    if (e.message === 'Unauthorized') {
      return null;
    }
    throw e;
  }
}

export async function createAccount(username: string, password: string, email: string, name: string) {
  try {
    const res = await post(`users/createAccount`, {
      username,
      password,
      email,
      name,
    });
    if (res.status !== 200) {
      throw new RequestError(res.status);
    }
    return res;
  } catch (e) {
    return Promise.reject(e);
  }
}
