import { v4 as uuid } from 'uuid';

export interface IChat {
  chatId: string;
  sessionId: string;
  userId: string;
  message: string;
  timestamp: number;
}

export class Chat implements IChat {

  public static createChat(sessionId: string, userId: string, message: string) {
    return new Chat(
      uuid(),
      sessionId,
      userId,
      message,
      Date.now(),
    );
  }

  constructor(
    public chatId: string,
    public sessionId: string,
    public userId: string,
    public message: string,
    public timestamp: number,
  ) {}
}
