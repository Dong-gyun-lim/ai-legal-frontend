'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTheme } from 'next-themes'; // ✅ 추가

type Prefs = {
    emailNotify: boolean;
    darkMode: boolean;
};

export default function SettingsPage() {
    const { theme, setTheme, resolvedTheme } = useTheme(); // ✅ next-themes 훅
    const [mounted, setMounted] = useState(false);
    const [prefs, setPrefs] = useState<Prefs>({ emailNotify: true, darkMode: false });

    // ✅ 초기화 (로컬 저장 + 현재 테마 상태 반영)
    useEffect(() => {
        const raw = localStorage.getItem('prefs');
        if (raw) {
            const parsed = JSON.parse(raw);
            setPrefs(parsed);
            // 저장된 다크모드 상태를 실제 theme에도 반영
            setTheme(parsed.darkMode ? 'dark' : 'light');
        } else {
            // next-themes 기본값 동기화
            setPrefs((p) => ({
                ...p,
                darkMode: (theme ?? resolvedTheme) === 'dark',
            }));
        }
        setMounted(true);
    }, [setTheme, theme, resolvedTheme]);

    if (!mounted) return null; // 서버-클라 차이 방지

    // ✅ 저장
    const save = () => {
        localStorage.setItem('prefs', JSON.stringify(prefs));
        toast.success('설정이 저장되었습니다.');
    };

    // ✅ 다크모드 스위치 변경 핸들러
    const handleDarkToggle = (v: boolean) => {
        setPrefs((p) => ({ ...p, darkMode: v }));
        setTheme(v ? 'dark' : 'light'); // 테마 즉시 전환
    };

    return (
        <div className="mx-auto max-w-3xl px-5 py-10">
            <Card className="rounded-2xl dark:border-slate-800 dark:bg-slate-900">
                <CardHeader>
                    <CardTitle>설정</CardTitle>
                    <CardDescription>알림 및 표시 환경을 관리하세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* 이메일 알림 */}
                    <div className="flex items-center justify-between rounded-md border p-3 dark:border-slate-800">
                        <div>
                            <Label className="block">이메일 알림</Label>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                중요 업데이트를 이메일로 받아요.
                            </p>
                        </div>
                        <Switch
                            checked={prefs.emailNotify}
                            onCheckedChange={(v) => setPrefs((p) => ({ ...p, emailNotify: !!v }))}
                        />
                    </div>

                    {/* 다크 모드 */}
                    <div className="flex items-center justify-between rounded-md border p-3 dark:border-slate-800">
                        <div>
                            <Label className="block">다크 모드</Label>
                            <p className="text-xs text-slate-500 dark:text-slate-400">베타</p>
                        </div>
                        <Switch
                            checked={prefs.darkMode}
                            onCheckedChange={handleDarkToggle} // ✅ 전환 로직 연결
                        />
                    </div>

                    {/* 버튼 영역 */}
                    <div className="flex gap-2">
                        <Button onClick={save}>저장</Button>
                        <Button asChild variant="outline">
                            <a href="/">홈으로</a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
