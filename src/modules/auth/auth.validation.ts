import z from "zod";
import { generalFields } from "../../common";

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

export const verifyAccountSchema = z.object({
  email: generalFields.email,
  otp: z.string(),
});

export const sendOTPSchema = z.object({
  email: generalFields.email,
});

export const resetPasswordSchema = z.object({
  email: generalFields.email,
  newPassword: generalFields.password,
  otp: z.string(),
});
