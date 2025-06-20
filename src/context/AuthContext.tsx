import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  userToken: string | null;
  isGuest: boolean;
  isLoading: boolean;
  justLoggedOut: boolean;
  setJustLoggedOut: (value: boolean) => void;
  signIn: (credentials: {
    username: string;
    password: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  goToLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userToken: null,
  isGuest: false,
  isLoading: true,
  justLoggedOut: false,
  setJustLoggedOut: () => {},
  signIn: async () => {},
  signOut: async () => {},
  continueAsGuest: async () => {},
  goToLogin: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  const signIn = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await fetch("https://fakestoreapi.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("userToken", data.token);
        setUserToken(data.token);
        setIsGuest(false);
        setJustLoggedOut(false);
      } else {
        throw new Error(data.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.multiRemove(["userToken", "isGuest"]);
      setUserToken(null);
      setIsGuest(false);
      setJustLoggedOut(true);
    } finally {
      setIsLoading(false);
    }
  };

  const goToLogin = async () => {
    try {
      setIsLoading(true);
      setJustLoggedOut(false);
      setUserToken(null);
      setIsGuest(false);
    } finally {
      setIsLoading(false);
    }
  };

  const continueAsGuest = async () => {
    await AsyncStorage.setItem("isGuest", "true");
    setIsGuest(true);
    setUserToken(null);
    setJustLoggedOut(false);
  };

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const [token, guest] = await AsyncStorage.multiGet([
          "userToken",
          "isGuest",
        ]);
        setUserToken(token[1]);
        setIsGuest(guest[1] === "true");
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthState();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userToken,
        isGuest,
        isLoading,
        justLoggedOut,
        setJustLoggedOut,
        signIn,
        signOut,
        continueAsGuest,
        goToLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
