import * as bcrypt from "bcrypt";

/**
 * @description hash password
 * @param password 
 * @returns 
 */
export async function hash(password: string) {
  return bcrypt.hash(password, 10);
}

/**
 * @param password wich come from FE
 * @param hashedPassword wich come from DB
 * @returns Promise of boolean
 */

export async function compare(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}



