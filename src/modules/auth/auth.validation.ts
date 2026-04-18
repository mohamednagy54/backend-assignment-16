import z from "zod";
import { SignupDto } from "./auth.dto";
import { generalFields, SYS_GENDER } from "../../common";

export const signupSchema = z.object({
  userName: generalFields.userName,
  email: generalFields.email,
  gender: generalFields.gender,
  password: generalFields.password,
  phoneNumber: generalFields.phoneNumber,
});

export const loginSchema = z.object({
  email: generalFields.email,
  password: generalFields.password,
});

export const forgetPasswordSchema = z.object({
  email: generalFields.email,
});
