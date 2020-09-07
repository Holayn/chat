import {get} from './fetch';

export async function isAuthorized() {
  try {
    await get('login/verify');
    return true;
  } catch {
    return false;
  }
}
