import { IUser } from './user';

export interface ISession {
  sessionId: string;
  type: string;
  userId: string;
  users: IUser[];
}

export class Session implements ISession {
  constructor(
    public sessionId: string,
    public type: string,
    public userId: string,
    public users: IUser[]) {}
}
