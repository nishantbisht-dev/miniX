"use client";
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { syncCurrentUser } from "@/lib/users";

type AuthContextType = { currentUser: User | null; loading: boolean; register: (name: string, username: string, email: string, password: string) => Promise<void>; login: (email: string, password: string) => Promise<void>; logout: () => Promise<void>; };
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function register(name: string, username: string, email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await syncCurrentUser(username);
  }
  async function login(email: string, password: string) { await signInWithEmailAndPassword(auth, email, password); await syncCurrentUser(); }
  async function logout() { await signOut(auth); }

  useEffect(() => { const unsub = onAuthStateChanged(auth, (user) => { setCurrentUser(user); setLoading(false); }); return () => unsub(); }, []);
  return <AuthContext.Provider value={{ currentUser, loading, register, login, logout }}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error("useAuth must be used inside AuthProvider"); return ctx; }
