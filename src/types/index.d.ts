import { Session, User } from "lucia";

export {};

declare global {
  namespace Express {
    interface Request {
      locals: {
        user: User & {
          role?: String;
        };
        session: Session;
      };
    }
  }
}
