import express from 'express';
import { Session } from '@chat/shared';
import { fetchSessions, getOtherUsersInSession, usersHaveSession, newSessions } from '../shared/session';
import { validateJwtMiddleware } from '../utils/jwt';

const router = express.Router();

/**
 * @description creates a new session between two users
 * @param user_id the other user id
 */
router.post(
  '/new',
  validateJwtMiddleware(),
  async (req: any, res: express.Response) => {
    if (!req.query.user_id) {
      res.sendStatus(400);
      return;
    }

    try {
      if (
        await usersHaveSession(req.user.userId, req.query.user_id)
      ) {
        res.statusMessage = `Session with ${req.query.user_id} already exists`;
        res.sendStatus(403);
        return;
      }
      const session = Session.createSession('regular', req.user.userId, []);
      await newSessions(
        session.sessionId,
        req.user.userId,
        req.query.user_id,
      );
      res.send(session);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }
);

/**
 * @description returns the session
 * @param session_id
 */
router.get('/session', validateJwtMiddleware(), async (req: any, res: express.Response) => {
  if (!req.query.session_id) {
    res.sendStatus(400);
    return;
  }
  try {
    const sessions = await fetchSessions(req.query.session_id);
    const users = await getOtherUsersInSession(sessions, req.user.userId);

    res.send(new Session(req.query.session_id, 'regular', req.user.userId, users, false));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export default router;
