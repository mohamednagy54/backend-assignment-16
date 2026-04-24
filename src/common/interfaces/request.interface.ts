import { IUser } from "./user.interface";

// re-open
declare module "express-serve-static-core" {
  interface Request {
    user: IUser;
    token: string;
  }
}
