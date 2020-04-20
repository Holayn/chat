import express from 'express';
import { v4 } from 'uuid';

import put from '../db/put';
import { getSessions } from '../shared/session';

const router = express.Router();

router.get('/', async (req: any, res: any) => {
  try {
    res.send(await getSessions(req.query.session_id));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/new', async (req: any, res: any) => {
  if (!req.query.user_id_1 || !req.query.user_id_2) {
    return;
  }
  try {
    const sessionId = v4();
    await put(newSessionParams(sessionId, req.query.user_id_1));
    await put(newSessionParams(sessionId, req.query.user_id_2));
    res.send({"session-id": sessionId});
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

function newSessionParams(sessionId: string, user: string) {
  return {
    TableName: 'session',
    Item: {
      'session-id': sessionId, // generate a unique session id
      'user-id': user,
      type: 'regular',
    },
  };
}

export default router;
