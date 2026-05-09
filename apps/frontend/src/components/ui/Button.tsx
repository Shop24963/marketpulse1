import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
export function Button({ children, className = '', ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) { return <button className={`rounded-2xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50 ${className}`} {...props}>{children}</button>; }
