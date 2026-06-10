import { InputHTMLAttributes } from "react";
type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string };
export default function Input({ label, className = "", ...props }: Props) { return <label className="block"><span className="mb-2 block text-sm font-medium text-slate-300">{label}</span><input className={`w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-500 ${className}`} {...props}/></label>; }
