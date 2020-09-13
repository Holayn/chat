import Cookies from 'js-cookie';

import {get} from './fetch';

export function getToken(): string | null {
  const token = Cookies.get('token');

  if (!token) {
    return null;
  }

  return token;
}

export async function isAuthorized() {
  if (!Cookies.get('token')) {
    return false;
  }

  try {
    const res = await get('login/verify');
    if (res.status !== 200) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
