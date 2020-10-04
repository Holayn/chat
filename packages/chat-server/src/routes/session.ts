import express from 'express';
import { Session } from '@chat/shared';
import { usersHaveSession, newSessions } from '../shared/session';
import { validateJwtMiddleware } from '../utils/jwt';

const router = express.Router();

// user_id_1 should be the user id of the client making the request
router.post(
  '/new',
  validateJwtMiddleware(),
  async (req: any, res: express.Response) => {
    if (!req.query.user_id_1 || !req.query.user_id_2) {
      res.sendStatus(400);
      return;
    }
    // only allow users to create new sessions between themself and another user
    if (!req.user.userId !== req.query.user_id_1) {
      res.sendStatus(403);
      return;
    }
    try {
      if (
        await usersHaveSession(req.query.user_id_1, req.query.user_id_2)
      ) {
        res.statusMessage = `Session with ${req.query.user_id_2} already exists`;
        res.sendStatus(403);
        return;
      }
      const session = Session.createSession('regular', req.query.user_id_1, []);
      await newSessions(
        session.sessionId,
        req.query.user_id_1,
        req.query.user_id_2
      );
      res.send(session);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }
);

export default router;
