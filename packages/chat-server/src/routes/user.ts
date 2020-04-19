import express from 'express';
import get from '../db/get';
import query from '../db/query';

const router = express.Router();

router.get('/sessions', async (req: any, res: any) => {
  const params = {
    TableName: 'session',
    IndexName:'user-id-index',
    KeyConditionExpression: '#u = :u',
    ExpressionAttributeValues: {
      ':u': `${req.query.user_id}`,
    },
    ExpressionAttributeNames: {
      '#u': 'user-id',
    },
  };

  try {
    res.send(await query(params));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/', async (req: any, res: any) => {
  const params = {
    TableName: 'user',
    Key: {
      'user-id': `${req.query.user_id}`,
    },
  };

  try {
    res.send(await get(params));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export default router;
