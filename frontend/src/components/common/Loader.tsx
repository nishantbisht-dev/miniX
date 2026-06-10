type LoaderProps = { text?: string };
export default function Loader({ text = "Loading..." }: LoaderProps) { return <div className="flex flex-col items-center justify-center p-8 text-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-sky-500"/><p className="mt-4 text-sm text-slate-500">{text}</p></div>; }
