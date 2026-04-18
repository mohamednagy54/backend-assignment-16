import z from "zod";
import { SYS_GENDER } from "../enums";


export const generalFields = {
  userName: z.string({message:"userName is required"}).min(2).max(20).meta({message:"userName must be at least 2 characters long and at most 20 characters long"}),
    email: z.email(),
  gender: z.enum(SYS_GENDER, {message:"must be a valid gender"}).optional(),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character"),
    phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/),
}