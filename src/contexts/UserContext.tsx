import React, { createContext, useState, useEffect, ReactNode } from "react";
import { fireAuth } from "../services/firebaseService";
import { User } from "firebase/auth";

export const AuthContext = createContext<User | null>(null);
interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = fireAuth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      return () => {
        unsubscribe();
      };
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
};
