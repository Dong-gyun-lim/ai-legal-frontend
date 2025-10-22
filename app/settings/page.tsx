'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Prefs = {
    emailNotify: boolean;
    darkMode: boolean;
};

export default function SettingsPage() {
    const [prefs, setPrefs] = useState<Prefs>({ emailNotify: true, darkMode: false });

    useEffect(() => {
        const raw = localStorage.getItem('prefs');
        if (raw) setPrefs(JSON.parse(raw));
    }, []);

    const save = () => {
        localStorage.setItem('prefs', JSON.stringify(prefs));
        toast.success('설정이 저장되었습니다.');
    };

    return (
        <div className="mx-auto max-w-3xl px-5 py-10">
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle>설정</CardTitle>
                    <CardDescription>알림 및 표시 환경을 관리하세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-md border p-3">
                        <div>
                            <Label className="block">이메일 알림</Label>
                            <p className="text-xs text-slate-500">중요 업데이트를 이메일로 받아요.</p>
                        </div>
                        <Switch
                            checked={prefs.emailNotify}
                            onCheckedChange={(v) => setPrefs((p) => ({ ...p, emailNotify: !!v }))}
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-md border p-3">
                        <div>
                            <Label className="block">다크 모드</Label>
                            <p className="text-xs text-slate-500">베타</p>
                        </div>
                        <Switch
                            checked={prefs.darkMode}
                            onCheckedChange={(v) => setPrefs((p) => ({ ...p, darkMode: !!v }))}
                        />
                    </div>

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
