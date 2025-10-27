'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

type User = { name?: string; email?: string; token?: string } | null;

function getInitials(name?: string) {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    return parts.length === 1 ? parts[0].slice(0, 2) : (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function SiteNav() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User>(null);

    // ▼ 드롭다운 상태 & 외부클릭 처리
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const readUser = () => {
        try {
            const raw =
                sessionStorage.getItem('user') || sessionStorage.getItem('authUser') || localStorage.getItem('user');
            setUser(raw ? JSON.parse(raw) : null);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        readUser();
    }, []);
    useEffect(() => {
        readUser();
    }, [pathname]);

    useEffect(() => {
        const onAuthChanged = () => readUser();
        const onStorage = () => readUser();
        const onFocus = () => readUser();
        const onVisibility = () => document.visibilityState === 'visible' && readUser();

        window.addEventListener('auth:changed', onAuthChanged as EventListener);
        window.addEventListener('storage', onStorage);
        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onVisibility);

        // 외부 클릭 닫기
        const onClickAway = (e: MouseEvent) => {
            const t = e.target as Node;
            if (!open) return;
            if (anchorRef.current?.contains(t)) return;
            if (menuRef.current?.contains(t)) return;
            setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('mousedown', onClickAway);
        window.addEventListener('keydown', onKey);

        return () => {
            window.removeEventListener('auth:changed', onAuthChanged as EventListener);
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onVisibility);
            window.removeEventListener('mousedown', onClickAway);
            window.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('authUser');
        localStorage.removeItem('user');
        setOpen(false);
        readUser();
        window.dispatchEvent(new Event('auth:changed'));
        toast.success('로그아웃 되었습니다.');
        router.push('/');
    };

    const handleNotReady = (label: string) => {
        toast('준비 중입니다', { description: `${label} 페이지는 곧 제공될 예정이에요.` });
        setOpen(false);
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur">
            <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
                {/* 로고 */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-slate-900" />
                    <span className="text-base font-semibold">DivorceInsight</span>
                </Link>

                {/* 우측 */}
                <nav className="relative flex items-center gap-2">
                    <Link
                        href="/intake"
                        className="hidden sm:inline-flex rounded-full border px-3 py-1.5 text-sm hover:bg-slate-50"
                    >
                        입력
                    </Link>
                    <Link
                        href="/analyze"
                        className="hidden sm:inline-flex rounded-full border px-3 py-1.5 text-sm hover:bg-slate-50"
                    >
                        분석
                    </Link>
                    <Link
                        href="/report"
                        className="hidden sm:inline-flex rounded-full border px-3 py-1.5 text-sm hover:bg-slate-50"
                    >
                        리포트
                    </Link>

                    {!user ? (
                        <>
                            <Link
                                href="/login"
                                className="inline-flex rounded-full border px-3 py-1.5 text-sm hover:bg-slate-50"
                            >
                                로그인
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex rounded-full bg-slate-900 px-3 py-1.5 text-sm text-white hover:opacity-90"
                            >
                                회원가입
                            </Link>
                            <Link
                                href="/demo"
                                className="hidden md:inline-flex rounded-full border px-3 py-1.5 text-sm hover:bg-slate-50"
                            >
                                데모 보기
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* ✅ 아바타 클릭 → 드롭다운 토글 (페이지 이동 없음) */}
                            <button
                                ref={anchorRef}
                                onClick={() => setOpen((s) => !s)}
                                title={user.name || user.email || '프로필'}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-600 text-white"
                                aria-haspopup="menu"
                                aria-expanded={open}
                            >
                                <span className="text-sm font-semibold leading-none select-none">
                                    {getInitials(user.name)}
                                </span>
                            </button>

                            {/* 드롭다운 메뉴 */}
                            {open && (
                                <div
                                    ref={menuRef}
                                    role="menu"
                                    className="absolute right-0 top-12 w-64 rounded-2xl border bg-white shadow-lg"
                                >
                                    {/* 상단 프로필 카드 */}
                                    <div className="p-4 border-b">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-600 text-white flex items-center justify-center font-semibold">
                                                {getInitials(user.name)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-medium truncate">{user.name || '사용자'}</div>
                                                <div className="text-xs text-slate-500 truncate">{user.email}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 액션들 */}
                                    <div className="p-1">
                                        <button
                                            onClick={() => {
                                                setOpen(false);
                                                router.push('/profile'); // ✅ 프로필 페이지로 이동
                                            }}
                                            className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-50"
                                        >
                                            프로필
                                        </button>

                                        <button
                                            onClick={() => {
                                                setOpen(false);
                                                router.push('/settings'); // ✅ 설정 페이지로 이동
                                            }}
                                            className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-50"
                                        >
                                            설정
                                        </button>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50"
                                        >
                                            로그아웃
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
