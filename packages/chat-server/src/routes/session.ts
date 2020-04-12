import express from 'express';
import client from '../client';

const router = express.Router();

router.get('/sessions', (req: any, res: any) => {
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
  
  client.query(params, (err, data) => {
    if (err) {
      console.error(err);
      res.send(500);
      return;
    }
    console.log(data);
    res.send(data);
  });
})

export default router;
