import { useLayoutEffect, useRef, useState } from "react";

import { getEncryptionKey } from "@/utils/actions/encryptionKey";
import { parseSensitiveData } from "@/utils/helpers/encryption";
import { QueryResponseType } from "./apiCall.type";

interface UseQueryType<T extends object, P extends object> {
  skipOnInit?: boolean;
  keepPreviousData?: boolean;
  initialParams?: P;
  keysToDecrypt?: (keyof T)[];
  promiseFn: (params?: Partial<P>) => QueryResponseType<T>;
}

export const useQuery = <T extends object, P extends object>({
  skipOnInit,
  keepPreviousData,
  initialParams,
  keysToDecrypt,
  promiseFn,
}: UseQueryType<T, P>) => {
  const [initialLoading, setInitialLoading] = useState(!skipOnInit);
  const [fetching, setFetching] = useState(false);
  const [params, setParams] = useState<P>({} as P);
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const apiCalledRef = useRef(false);

  const setDataHandler = (newData: T[]) => {
    if (!keepPreviousData) setData(newData);
    else setData((prevData) => [...prevData, ...newData]);
  };

  const fetchData = async (additionalParams?: P) => {
    if (fetching || (keepPreviousData && total && data.length >= total)) return;

    if (initialLoading) setInitialLoading(false);

    try {
      setFetching(true);
      const updatedParams = { ...params, ...additionalParams };
      const response = await promiseFn(updatedParams);
      console.info("Fetch response: ", response.total);
      setParams(updatedParams);
      if (keysToDecrypt?.length) {
        const encryptionKey = await getEncryptionKey();
        const decryptedData = response.data.map((item) =>
          parseSensitiveData("decrypt", item, keysToDecrypt, encryptionKey),
        );
        setDataHandler(decryptedData);
      } else setDataHandler(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error("Fetch error: ", error);
      setData([]);
      setTotal(null);
    } finally {
      setFetching(false);
    }
  };

  useLayoutEffect(() => {
    if (!skipOnInit && !apiCalledRef.current) fetchData(initialParams);

    apiCalledRef.current = true;

    return () => {
      apiCalledRef.current = false;
      setFetching(false);
      setData([]);
      setTotal(null);
    };
  }, [initialParams]);

  return { fetching: initialLoading || fetching, params, data, total, fetchData };
};
