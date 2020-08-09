import {API_URL} from '../shared';

export async function getSessions(userId: string) {
  const res = await fetch(`${API_URL}/users/sessions?user_id=${userId}`);
  return await res.json();
}