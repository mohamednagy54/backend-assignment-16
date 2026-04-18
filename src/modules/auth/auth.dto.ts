import z from "zod";
import { SYS_GENDER } from "../../common";
import { signupSchema } from "./auth.validation";



// export interface SignupDto {
//   email: string;
//   password: string;
//   userName: string;
//   phoneNumber?: string;
//   gender:SYS_GENDER
// }

export type SignupDto = z.infer<typeof signupSchema>

export interface LoginDto {
  email: string;
  password: string;
}

export interface VerifyAccountDTO {
  email: string;
  otp:string
}

export interface SendOTPDTO {
  email: string;
}



export interface ResetPasswordDto {
  email: string;
  newPassword: string;
  otp: string;
}

