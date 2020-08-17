export interface IUser {
  name: string;
  userId: string;
  username: string;
}

export class User implements IUser {
  constructor(public name: string, public userId: string, public username: string) {}
}
