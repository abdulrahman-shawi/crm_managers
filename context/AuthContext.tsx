"use client";

import { createContext, useContext } from "react";

interface User {
  email: string;
    name: string;       
    id: string;
    role: string;
}

interface AuthContextType {
  user: User | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
});

export const useAuth = () => useContext(AuthContext);
