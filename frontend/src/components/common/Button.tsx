import { ButtonHTMLAttributes, ReactNode } from "react";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode };
export default function Button({ children, className = "", ...props }: Props) { return <button className={`rounded-full bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60 ${className}`} {...props}>{children}</button>; }
