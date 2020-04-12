import express from 'express';
import query from '../db/query';

const router = express.Router();

router.get('/', async (req: any, res: any) => {
  const params = {
    TableName: 'chat',
    KeyConditionExpression: '#s = :s',
    ExpressionAttributeValues: {
      ':s': `${req.query.session_id}`,
    },
    ExpressionAttributeNames: {
      '#s': 'session-id'
    }
  };

  try {
    res.send(await query(params));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export default router;
