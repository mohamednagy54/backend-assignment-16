import crypto from "node:crypto";

export function encrypt(plaintext: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from("12345678901234567890123456789012"),
    iv,
  );

  let encryptedData = cipher.update(plaintext, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  return `${iv.toString("hex")}:${encryptedData}`;
}



export function decrypt(encryptedData: string) {
  const [iv, encryptedvalue] = encryptedData.split(":");
  const ivBuffer = Buffer.from(iv as string, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from("12345678901234567890123456789012"),
    ivBuffer,
  );

  let decryptedData = decipher.update(encryptedvalue as string, "hex", "utf-8");
  decryptedData += decipher.final("utf-8");
  return decryptedData;
}