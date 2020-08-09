import {API_URL} from '../shared';

export async function getUserByUsername(username: string) {
  if (!username) {
    return;
  }
  const res = await fetch(`${API_URL}/users/findByUsername?username=${username}`);
  const user = (await res.json());

  return user;
}

export async function getUserById(userId: string) {
  if (!userId) {
    return;
  }
  const res = await fetch(`${API_URL}/users?user_id=${userId}`);
  const user = (await res.json());

  return user;
}
