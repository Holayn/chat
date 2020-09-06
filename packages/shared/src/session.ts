import { IUser } from './user';
import { v4 as uuid } from 'uuid';

export interface ISession {
  sessionId: string;
  type: string;
  userId: string;
  users: IUser[];
}

export class Session implements ISession {
  public static createSession(type: string, userId: string, users: IUser[]) {
    return new Session(uuid(), type, userId, users);
  }
  
  constructor(
    public sessionId: string,
    public type: string,
    public userId: string,
    public users: IUser[]) {}
}
