import express from 'express';
import query from '../db/query';

const router = express.Router();

router.get('/', async (req: any, res: any) => {
  const params = {
    TableName: 'session',
    KeyConditionExpression: '#u = :u',
    ExpressionAttributeValues: {
      ':u': `${req.query.user_id}`,
    },
    ExpressionAttributeNames: {
      '#u': 'user-id'
    }
  }

  try {
    res.send(await query(params));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export default router;
