"use client";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
export default function LoginPage(){ const { login }=useAuth(); const router=useRouter(); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [loading,setLoading]=useState(false); async function submit(e:React.FormEvent){e.preventDefault(); try{setLoading(true); await login(email,password); toast.success("Logged in"); router.push("/feed");}catch(e:any){toast.error(e.message||"Login failed");}finally{setLoading(false);} } return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white"><form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/40 p-8"><h1 className="text-3xl font-bold">Login</h1><div className="mt-6 space-y-5"><Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)}/><Input label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/><Button disabled={loading} className="w-full">{loading?"Logging in...":"Login"}</Button></div><p className="mt-5 text-sm text-slate-400">No account? <Link href="/register" className="text-sky-400">Register</Link></p></form></main>; }
