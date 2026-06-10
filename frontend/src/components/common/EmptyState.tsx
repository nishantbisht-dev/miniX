import { ReactNode } from "react";
type Props = { title: string; description: string; icon?: ReactNode };
export default function EmptyState({ title, description, icon }: Props) { return <div className="flex flex-col items-center justify-center p-10 text-center">{icon && <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-slate-400">{icon}</div>}<h2 className="text-lg font-semibold text-white">{title}</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">{description}</p></div>; }
