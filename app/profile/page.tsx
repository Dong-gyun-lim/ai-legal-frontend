'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type User = { name?: string; email?: string } | null;

function initials(name?: string) {
    if (!name) return 'U';
    const p = name.trim().split(/\s+/);
    return p.length === 1 ? p[0].slice(0, 2) : (p[0][0] + p[1][0]).toUpperCase();
}

export default function ProfilePage() {
    const [user, setUser] = useState<User>(null);

    useEffect(() => {
        try {
            const raw =
                sessionStorage.getItem('user') || sessionStorage.getItem('authUser') || localStorage.getItem('user');
            setUser(raw ? JSON.parse(raw) : null);
        } catch {
            setUser(null);
        }
    }, []);

    return (
        <div className="mx-auto max-w-3xl px-5 py-10">
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle>프로필</CardTitle>
                    <CardDescription>계정 기본 정보를 확인하세요.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-slate-600 text-white flex items-center justify-center text-lg font-semibold">
                            {initials(user?.name)}
                        </div>
                        <div>
                            <div className="text-lg font-semibold">{user?.name ?? '사용자'}</div>
                            <div className="text-sm text-slate-500">{user?.email ?? '-'}</div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-3">
                        <div className="text-sm text-slate-600">향후: 이름/비밀번호 변경, 연결 계정 등 추가 가능</div>
                        <div className="flex gap-2">
                            <Button asChild variant="outline">
                                <a href="/settings">설정으로 이동</a>
                            </Button>
                            <Button asChild>
                                <a href="/">홈으로</a>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
