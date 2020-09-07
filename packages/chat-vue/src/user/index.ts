import {IUser} from '@chat/shared';
import Cookies from 'js-cookie';

import {get} from '../utils/fetch';

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

export async function login(username: string, password: string): Promise<boolean> {
  try {
    const jwt = await get(`login?username=${username}&pass=${password}`, false);
    Cookies.set('token', jwt);
    return true;
  } catch (e) {
    if (e.message === 'Unauthorized') {
      return false;
    }
    throw e;
  }
}
