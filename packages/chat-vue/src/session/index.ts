import {ISession} from '@chat/shared';
import {get} from '../utils/fetch';

export async function getSessions(userId: string): Promise<ISession[]> {
  return await get(`users/sessions?user_id=${userId}`);
}
