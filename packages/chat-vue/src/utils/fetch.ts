import Cookies from 'js-cookie';

import {API_URL} from '../shared';

export async function get(path: string, auth: boolean = true) {
  if (!auth) {
    return (await fetch(`${API_URL}/${path}`)).json();
  }
  return (await fetch(`${API_URL}/${path}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
    credentials: 'same-origin',
  })).json();
}
