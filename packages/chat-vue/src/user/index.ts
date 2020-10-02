import {IUser} from '@chat/shared';

import {get, post} from '../utils/fetch';

export async function getUserByUsername(username: string) {
  const res = await get<IUser>(`users/findByUsername?username=${username}`);
  if (!res.userId) {
    return null;
  }
  return res;
}

export async function login(username: string, password: string) {
  const res = await get<{token: string}>(`login?username=${username}&pass=${password}`, false);
  return res.token;
}

export async function createAccount(username: string, password: string, email: string, name: string) {
  return await post(`users/createAccount`, {
    username,
    password,
    email,
    name,
  });
}
