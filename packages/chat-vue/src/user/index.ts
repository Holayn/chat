import {API_URL} from '../shared';

export async function getUser(username: string) {
  if (!username) {
    return;
  }
  const res = await fetch(`${API_URL}/users/findByUsername?username=${username}`);
  const user = (await res.json());

  return user;
}
