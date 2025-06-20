import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  userToken: string | null;
  isGuest: boolean;
  isLoading: boolean;
  signIn: (credentials: {
    username: string;
    password: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userToken: null,
  isGuest: false,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
  continueAsGuest: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const signIn = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      // Your actual login API call
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
      } else {
        throw new Error(data.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await AsyncStorage.multiRemove(["userToken", "isGuest"]);
    setUserToken(null);
    setIsGuest(false);
  };

  const continueAsGuest = async () => {
    await AsyncStorage.setItem("isGuest", "true");
    setIsGuest(true);
    setUserToken(null);
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
        signIn,
        signOut,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
