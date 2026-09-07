import crypto from "crypto";

const ALGO = "aes-256-gcm";
const IV_BYTES = 12; // recommended for GCM

export function encryptText(plaintext: string, encryptionKey: Buffer<ArrayBuffer>) {
  const iv = crypto.randomBytes(IV_BYTES);
  const cipher = crypto.createCipheriv(ALGO, encryptionKey, iv);

  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  // store iv:tag:ciphertext as hex parts
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptText(encryptedText: string, encryptionKey: Buffer<ArrayBuffer>) {
  const [ivHex, tagHex, dataHex] = encryptedText.split(":");
  if (!ivHex || !tagHex || !dataHex) throw new Error("Invalid payload");

  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const encrypted = Buffer.from(dataHex, "hex");

  const decipher = crypto.createDecipheriv(ALGO, encryptionKey, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}

export function parseSensitiveData<T extends object>(
  type: "encrypt" | "decrypt",
  data: T,
  keysToEncrypt: (keyof T)[],
  encryptionKey: Buffer<ArrayBuffer>,
) {
  const encryptedData = { ...data };

  keysToEncrypt.forEach((key) => {
    if (data[key] && typeof data[key] === "string") {
      try {
        if (type === "encrypt") {
          encryptedData[key] = encryptText(data[key], encryptionKey) as T[typeof key];
        } else if (type === "decrypt") {
          encryptedData[key] = decryptText(data[key], encryptionKey) as T[typeof key];
        }
      } catch (error) {
        console.error(`Failed to ${type} key ${String(key)}:`, error);
      }
    }
  });

  return encryptedData;
}
