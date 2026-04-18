import { model, Schema } from "mongoose";
import { IUser, SYS_GENDER, SYS_PROVIDER, SYS_Role } from "../../../common";

const schema = new Schema<IUser>(
  {
    userName: { type: String, required: true, minLength: 2, maxLength: 20 },
    email: { type: String, required: true },
    password: {
      type: String,
      required: function () {
        if (this.provider === SYS_PROVIDER.google) return false;
        return true;
      },
    },
    role: { type: Number, enum: SYS_Role, default: SYS_Role.user },
    provider: {
      type: Number,
      enum: SYS_PROVIDER,
      default: SYS_PROVIDER.system,
    },
    profilePic: { type: String },
    gender: { type: Number, enum: SYS_GENDER, default: SYS_GENDER.male },
    phoneNumber: { type: String },
  },
  { timestamps: true },
);

export const User = model("User", schema);
