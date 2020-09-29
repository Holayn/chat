import Cookies from 'js-cookie';

import {API_URL} from '../shared';

export async function get(path: string, auth: boolean = true) {
  if (!auth) {
    const noAuthRes = await fetch(`${API_URL}/${path}`);
    if (noAuthRes.headers.get('content-type')!.split(';')[0] === 'application/json') {
      return noAuthRes.json();
    }

    return noAuthRes;
  }
  const res = await fetch(`${API_URL}/${path}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
    credentials: 'same-origin',
  });

  if (res.headers.get('content-type')!.split(';')[0] === 'application/json') {
    return res.json();
  }

  return res;
}

export async function post(path: string, payload: Record<string, any>) {
  return await fetch(`${API_URL}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}
