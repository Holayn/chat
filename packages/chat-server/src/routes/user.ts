import express from 'express';
import get from '../db/get';

const router = express.Router();

router.get('/', async (req: any, res: any) => {
  const params = {
    TableName: 'user',
    Key: {
      'user-id': `${req.query.user_id}`
    }
  }

  try {
    res.send(await get(params));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export default router;
