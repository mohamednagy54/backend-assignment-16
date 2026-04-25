import { Types } from "mongoose";
import { SYS_GENDER, SYS_PROVIDER, SYS_Role } from "../enums";

export interface IUser {
  _id: Types.ObjectId;
  userName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  gender: SYS_GENDER | undefined;
  role: SYS_Role;
  provider: SYS_PROVIDER;
  profilePic: string;
}
