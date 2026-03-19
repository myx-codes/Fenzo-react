import { ReactNode, useState, useCallback } from "react";
import { User } from "../../lib/types/user";
import { LoginInput, UserInput } from "../../lib/types/user";
import Cookies from "universal-cookie";
import { GlobalContext, GlobalContextValue } from "../hooks/useGlobals";
import UserService from "../services/UserService";
import {
  LANGUAGE_STORAGE_KEY,
  SupportedLanguage,
  TranslationKey,
  translations,
} from "../i18n/translations";

const cookies = new Cookies();
const userService = new UserService();

const ACCESS_TOKEN_KEY = "accessToken";
const USER_DATA_KEY = "userData";

const localeByLanguage: Record<SupportedLanguage, string> = {
  en: "en-US",
  uz: "uz-UZ",
  ko: "ko-KR",
};

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_DATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readStoredLanguage(): SupportedLanguage {
  const raw = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (raw === "uz" || raw === "ko" || raw === "en") {
    return raw;
  }
  return "en";
}

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<User | null>(readStoredUser);
  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());
  const [language, setLanguageState] = useState<SupportedLanguage>(readStoredLanguage);

  const login = useCallback(async (input: LoginInput) => {
    const { user, accessToken } = await userService.login(input);
    cookies.set(ACCESS_TOKEN_KEY, accessToken, {
      path: "/",
      sameSite: "lax",
      secure: window.location.protocol === "https:",
    });
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    setAuthUser(user);
  }, []);

  const signup = useCallback(async (input: UserInput) => {
    const { user, accessToken } = await userService.signup(input);
    cookies.set(ACCESS_TOKEN_KEY, accessToken, {
      path: "/",
      sameSite: "lax",
      secure: window.location.protocol === "https:",
    });
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    setAuthUser(user);
  }, []);

  const logout = useCallback(() => {
    cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    setAuthUser(null);
  }, []);

  const setLanguage = useCallback((nextLanguage: SupportedLanguage) => {
    setLanguageState(nextLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => {
      return translations[language][key] ?? translations.en[key] ?? key;
    },
    [language]
  );

  const value: GlobalContextValue = {
    authUser,
    setAuthUser,
    orderBuilder,
    setOrderBuilder,
    language,
    setLanguage,
    locale: localeByLanguage[language],
    t,
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
