import Cookies from 'js-cookie';

import {API_URL} from '../shared';
import {RequestError} from '../shared/errors';

export async function get<T>(path: string, auth: boolean = true): Promise<T> {
  try {
    if (!auth) {
      const noAuthRes = await fetch(`${API_URL}/${path}`);
      if (noAuthRes.headers.get('content-type')!.split(';')[0] === 'application/json') {
        return await noAuthRes.json();
      }

      return <unknown>noAuthRes as T;
    }
    const res = await fetch(`${API_URL}/${path}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      credentials: 'same-origin',
    });

    if (res.headers.get('content-type')!.split(';')[0] === 'application/json') {
      return await res.json();
    }

    return <unknown>res as T;
  } catch (e) {
    if (e.message === 'Unauthorized') {
      throw new RequestError(401);
    }
    throw new RequestError(500);
  }
}

export async function post(path: string, payload: Record<string, any>) {
  try {
    const res = await fetch(`${API_URL}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.status !== 200) {
      throw new RequestError(res.status);
    }
    return res;
  } catch (e) {
    if (e instanceof RequestError) {
      throw e;
    }
    throw new RequestError(500);
  }
}
