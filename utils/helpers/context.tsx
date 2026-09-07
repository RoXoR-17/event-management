import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

import { fetchData, storeData } from "./localStorage";

export const COLOR_OPTIONS = ["#1677ff", "#e88c1d", "#f5222d", "#52c41a"] as const;

export type ColorOptionType = (typeof COLOR_OPTIONS)[number];

export type NavLayoutType = "top" | "side";

interface MainContextType {
  userData: User | null;
  navLayoutType: NavLayoutType;
  setNavLayoutType: (type: NavLayoutType) => void;
  primaryColor: ColorOptionType;
  primaryColorChangeHandler: (color: ColorOptionType) => void;
  refetchAppointments: boolean;
  setRefetchAppointments: (refetchAppointments: boolean) => void;
}

const MainContext = createContext<MainContextType>({} as MainContextType);

interface MainContextProviderProps extends React.PropsWithChildren {
  user: User | null;
}

const MainContextProvider = ({ user, children }: MainContextProviderProps) => {
  const [userData, setUserData] = useState<User | null>(user);
  const [navLayoutType, setNavLayoutType] = useState<NavLayoutType>("top");
  const [primaryColor, setPrimaryColor] = useState<ColorOptionType>(COLOR_OPTIONS[0]);
  const [refetchAppointments, setRefetchAppointments] = useState(false);

  useEffect(() => {
    const userData = fetchData("userData");
    if (userData) setUserData(userData);
    const navLayoutType = fetchData("navLayoutType");
    if (navLayoutType) setNavLayoutType(navLayoutType);
  }, []);

  useEffect(() => {
    setUserData(user);
  }, [user]);

  useEffect(() => storeData("userData", userData), [userData]);
  useEffect(() => storeData("navLayoutType", navLayoutType), [navLayoutType]);

  const primaryColorChangeHandler = (color: ColorOptionType) => {
    const el = document.querySelector<HTMLElement>(".css-var-«r0»");
    if (!el) return;

    el.style.setProperty("--rs-color-primary", color);
    setPrimaryColor(color);
  };

  return (
    <MainContext.Provider
      value={{
        userData,
        navLayoutType,
        setNavLayoutType,
        primaryColor,
        primaryColorChangeHandler,
        refetchAppointments,
        setRefetchAppointments,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

const useMainContext = () => useContext(MainContext);

export { MainContextProvider, useMainContext };
