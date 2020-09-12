import Cookies from 'js-cookie';

import {get} from './fetch';

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
