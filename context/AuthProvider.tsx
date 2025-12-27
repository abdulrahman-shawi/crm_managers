"use client";

import { AuthContext } from "./AuthContext";

export default function AuthProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { email: string; name: string; id: string; role: string, isActive: boolean } | null;
}) {
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}
