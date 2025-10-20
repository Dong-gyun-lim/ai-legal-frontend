import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/Lib/auth';
import Avatar from '@/components/Avatar';

export default function UserMenu() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        };
        window.addEventListener('click', onClick);
        return () => window.removeEventListener('click', onClick);
    }, []);

    if (!user) return null;

    return (
        <div ref={ref} className="relative">
            <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2">
                <Avatar size={32} name={user.name} src={user.avatarUrl} />
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-44 rounded-lg border border-slate-200 bg-white shadow-md p-1">
                    <div className="px-3 py-2 text-sm">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-slate-500">{user.email}</div>
                    </div>
                    <a href="/profile" className="block px-3 py-2 text-sm hover:bg-slate-50 rounded-md">
                        프로필
                    </a>
                    <button
                        onClick={logout}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded-md"
                    >
                        로그아웃
                    </button>
                </div>
            )}
        </div>
    );
}
