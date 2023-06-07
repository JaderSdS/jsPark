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
    // Monitorar alterações no estado de autenticação do Firebase
    const unsubscribe = fireAuth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      return () => {
        unsubscribe();
      };
    });

    // Cancelar a inscrição ao desmontar o componente
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
};
