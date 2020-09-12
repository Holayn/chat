import Cookies from 'js-cookie';

import {API_URL} from '../shared';

export async function get(path: string, auth: boolean = true) {
  if (!auth) {
    const res = await fetch(`${API_URL}/${path}`);
    if (res.headers.get('content-type')!.split(';')[0] === 'application/json') {
      return res.json();
    }

    return res;
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
