import { User } from '@chat/shared';
import get from '../db/get';

export async function getUser(userId: string): Promise<User> {
  const params = {
    TableName: 'user',
    Key: {
      'user-id': `${userId}`
    }
  };

  try {
    const res = await get(params);
    return new User(
      res.name as string,
      res['user-id'] as string,
      res.username as string
    );
  } catch (e) {
    throw e;
  }
}
