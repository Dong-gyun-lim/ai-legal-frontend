import * as React from 'react';

export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    const base =
        'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none ' +
        'placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/10';
    return <input className={`${base} ${className}`} {...props} />;
}
