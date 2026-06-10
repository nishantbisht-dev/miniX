"use client";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { getProfileInitialValues, updateUserProfile } from "@/lib/users";
import { UserProfile } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
export default function EditProfileForm({ profile }: { profile: UserProfile }){ const router=useRouter(); const init=getProfileInitialValues(profile); const [name,setName]=useState(init.name); const [username,setUsername]=useState(init.username); const [bio,setBio]=useState(init.bio); const [loading,setLoading]=useState(false); async function submit(e:React.FormEvent){e.preventDefault(); try{setLoading(true); await updateUserProfile({uid:profile.uid,name,username,bio}); toast.success("Profile updated"); router.push("/profile");}catch(e:any){toast.error(e.message||"Update failed");}finally{setLoading(false);} } return <form onSubmit={submit} className="space-y-5 p-5"><Input label="Name" value={name} onChange={e=>setName(e.target.value)}/><Input label="Username" value={username} onChange={e=>setUsername(e.target.value)}/><label className="block"><span className="mb-2 block text-sm font-medium text-slate-300">Bio</span><textarea value={bio} onChange={e=>setBio(e.target.value)} className="min-h-32 w-full rounded-xl border border-slate-800 bg-slate-900 p-4 outline-none focus:border-sky-500"/></label><Button disabled={loading}>{loading?"Saving...":"Save changes"}</Button></form>; }
