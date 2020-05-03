import express from 'express';
import { v4 } from 'uuid';

import put from '../db/put';
import { getSessions } from '../shared/session';
import { getUserSessions } from './user';

const router = express.Router();

router.get('/', async (req: any, res: any) => {
  try {
    res.send(await getSessions(req.query.session_id));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// user_id_1 should be the user id of the client making the request
router.post('/new', async (req: any, res: express.Response) => {
  if (!req.query.user_id_1 || !req.query.user_id_2) {
    res.sendStatus(400);
  }
  try {
    if (!(await checkSessions(req.query.user_id_1, req.query.user_id_2))) {
      res.statusMessage = `Session with ${req.query.user_id_2} already exists`;
      res.sendStatus(403);
    }

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

async function checkSessions(userId: string, otherUserId: string) {
  if (!userId || !otherUserId) {
    throw new Error('validation failed');
  }
  try {
    const sessions = await getUserSessions(userId);
    for (let i=0; i<sessions.length; i++) {
      if (sessions[i].users[0] === otherUserId) {
        return false;
      }
    }
    return true;
  } catch (e) {
    throw new Error(e);
  }
}

export default router;
