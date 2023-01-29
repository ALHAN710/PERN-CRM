import { onAuthStateChanged, User } from "firebase/auth";
import React from "react";
import { auth } from "../services/auth/firebase-config";
import { IUserContext } from "../types/userType";
import { Props } from "../types/utils";

export type T_Theme =  "light" | "dark" | "system";

type T_ThemeContext = {
  theme: T_Theme;
  toggleTheme: (theme: T_Theme) => void
}

export type TContextAPI = IUserContext & T_ThemeContext;

export const ContextAPI = React.createContext<TContextAPI | null>(null);

export const ContextProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);

  const defaultTheme = window.matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light"
  const mode = (window.localStorage.getItem("theme")  || defaultTheme) as T_Theme;
  const [theme, setTheme] = React.useState<T_Theme>(mode);
  if(!("theme" in window.localStorage)) {
    window.localStorage.setItem("theme", defaultTheme)
  }
  const toggleTheme = (theme: T_Theme) => {
    setTheme(theme);
    if (theme !== "system") {
      window.localStorage.setItem("theme", theme);
    } else {
      window.localStorage.removeItem("theme");
    };
  };

  if (
    theme === "dark" || theme === "system"
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  React.useEffect(() => {
    console.log("theme", theme);
    // Adds an observer for changes to the user's authentication state.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    if (
      theme === "dark" || theme === "system"
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Clean up the subscription
    return unsubscribe;
  }, [user, theme]);

  return (
    <ContextAPI.Provider value={{ user, setUser, theme, toggleTheme }}>
      {children}
    </ContextAPI.Provider>
  );
};
