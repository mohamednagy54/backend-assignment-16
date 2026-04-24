import z from "zod";
import {
  loginSchema,
  resetPasswordSchema,
  sendOTPSchema,
  signupSchema,
  verifyAccountSchema,
} from "./auth.validation";

export type SignupDto = z.infer<typeof signupSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type VerifyAccountDTO = z.infer<typeof verifyAccountSchema>;
export type SendOTPDTO = z.infer<typeof sendOTPSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
