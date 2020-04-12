import express from 'express';
import client from '../client';

const router = express.Router();

router.get('/chats', (req: any, res: any) => {
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

  client.query(params, (err, data) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
    console.log(data);
    res.send(data);
  });
});

export default router;
