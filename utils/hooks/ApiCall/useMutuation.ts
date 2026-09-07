import { getEncryptionKey } from "@/utils/actions/encryptionKey";
import { parseSensitiveData } from "@/utils/helpers/encryption";
import { useState } from "react";

interface UseMutuationType<P extends object> {
  keysToEncrypt?: (keyof P)[];
  promiseFn: (payload: P) => Promise<void>;
  onSuccess?: () => void;
  onError?: () => void;
}

export const useMutuation = <P extends object = object>({
  keysToEncrypt,
  promiseFn,
  onSuccess,
  onError,
}: UseMutuationType<P>) => {
  const [mutuating, setMutuating] = useState(false);

  const mutuateData = async (payload: P) => {
    try {
      setMutuating(true);
      let encryptedPayload = { ...payload };
      if (keysToEncrypt?.length) {
        const encryptionKey = await getEncryptionKey();
        encryptedPayload = parseSensitiveData("encrypt", payload, keysToEncrypt, encryptionKey);
      }
      const response = await promiseFn(encryptedPayload);
      console.info("Mutuate response: ", response);
      // success = true;
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Mutuate error: ", error);
      if (onError) onError();
    } finally {
      setMutuating(false);
    }
  };

  return { mutuating, mutuateData };
};
