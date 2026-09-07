"use server";

export async function getEncryptionKey() {
  const KEY_HEX = process.env.ENCRYPTION_KEY!;

  if (!KEY_HEX) throw new Error("ENCRYPTION_KEY missing");

  const KEY = Buffer.from(KEY_HEX, "hex");
  if (KEY.length !== 32) throw new Error("ENCRYPTION_KEY must be 32 bytes (hex 64 chars)");

  return KEY;
}
