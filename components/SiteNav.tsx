'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type User = { name?: string; email?: string; token?: string } | null;

function getInitials(name?: string) {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    return parts.length === 1 ? parts[0].slice(0, 2) : (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function SiteNav() {
    const router = useRouter();
    const pathname = usePathname(); // 경로 바뀔 때도 동기화
    const [user, setUser] = useState<User>(null);

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
        readUser(); // 최초
    }, []);

    useEffect(() => {
        // 커스텀 이벤트, storage(다른 탭), 포커스/가시성 변경 때 동기화
        const onAuthChanged = () => readUser();
        const onStorage = () => readUser();
        const onFocus = () => readUser();
        const onVisibility = () => document.visibilityState === 'visible' && readUser();

        window.addEventListener('auth:changed', onAuthChanged as EventListener);
        window.addEventListener('storage', onStorage);
        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            window.removeEventListener('auth:changed', onAuthChanged as EventListener);
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    useEffect(() => {
        // 라우트 바뀌어도 한 번 더 동기화 (App Router는 헤더가 유지되므로 수동 갱신)
        readUser();
    }, [pathname]);

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('authUser');
        localStorage.removeItem('user');
        readUser();
        window.dispatchEvent(new Event('auth:changed')); // 🔔 브로드캐스트
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur">
            <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-slate-900" />
                    <span className="text-base font-semibold">DivorceInsight</span>
                </Link>

                <nav className="flex items-center gap-2">
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
                            <button
                                onClick={() => router.push('/profile')}
                                title={user.name || user.email || '프로필'}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-600 text-white"
                            >
                                <span className="text-sm font-semibold leading-none select-none">
                                    {getInitials(user.name)}
                                </span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="hidden md:inline-flex rounded-full border px-3 py-1.5 text-sm hover:bg-slate-50"
                            >
                                로그아웃
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
