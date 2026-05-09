import type { PropsWithChildren } from 'react';
export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) { return <section className={`card p-5 ${className}`}>{children}</section>; }
