import { createContext, useContext } from "react";
import { User, LoginInput, UserInput } from "../../lib/types/user";

export interface GlobalContextValue {
  authUser: User | null;
  setAuthUser: (user: User | null) => void;
  orderBuilder: Date;
  setOrderBuilder: (d: Date) => void;
  login: (input: LoginInput) => Promise<void>;
  signup: (input: UserInput) => Promise<void>;
  logout: () => void;
}

export const GlobalContext = createContext<GlobalContextValue | null>(null);

export function useGlobals(): GlobalContextValue {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobals must be used within ContextProvider (ProviderContext)");
  return ctx;
}
