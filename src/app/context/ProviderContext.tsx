import { ReactNode, useState, useCallback } from "react";
import { User } from "../../lib/types/user";
import { LoginInput, UserInput } from "../../lib/types/user";
import Cookies from "universal-cookie";
import { GlobalContext, GlobalContextValue } from "../hooks/useGlobals";
import UserService from "../services/UserService";

const cookies = new Cookies();
const userService = new UserService();

const ACCESS_TOKEN_KEY = "accessToken";
const USER_DATA_KEY = "userData";

function readStoredUser(): User | null {
  if (!cookies.get(ACCESS_TOKEN_KEY)) {
    localStorage.removeItem(USER_DATA_KEY);
    return null;
  }
  try {
    const raw = localStorage.getItem(USER_DATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<User | null>(readStoredUser);
  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

  const login = useCallback(async (input: LoginInput) => {
    const { user, accessToken } = await userService.login(input);
    cookies.set(ACCESS_TOKEN_KEY, accessToken, { path: "/" });
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    setAuthUser(user);
  }, []);

  const signup = useCallback(async (input: UserInput) => {
    const { user, accessToken } = await userService.signup(input);
    cookies.set(ACCESS_TOKEN_KEY, accessToken, { path: "/" });
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    setAuthUser(user);
  }, []);

  const logout = useCallback(() => {
    cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
    localStorage.removeItem(USER_DATA_KEY);
    setAuthUser(null);
  }, []);

  const value: GlobalContextValue = {
    authUser,
    setAuthUser,
    orderBuilder,
    setOrderBuilder,
    login,
    signup,
    logout,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;
