'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/src/components/ui/textarea';

export default function IntakePage() {
    const router = useRouter();
    const [form, setForm] = useState({ title: '', reason: '', summary: '' });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('입력된 사건:', form);
        alert('입력 완료! 분석 페이지로 이동합니다.');
        router.push('/analyze');
        sessionStorage.setItem('intakeForm', JSON.stringify(form));
        router.push('/analyze');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Card className="w-full max-w-lg shadow-md">
                <CardHeader>
                    <CardTitle>사건 정보 입력</CardTitle>
                    <CardDescription>아래 사건 정보를 입력하세요.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            name="title"
                            placeholder="사건 제목"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            name="reason"
                            placeholder="주요 사유 (예: 외도, 폭행, 경제적 문제)"
                            value={form.reason}
                            onChange={handleChange}
                        />
                        <Textarea
                            name="summary"
                            placeholder="사건 요약을 입력하세요..."
                            rows={5}
                            value={form.summary}
                            onChange={handleChange}
                        />
                        <Button type="submit" className="w-full">
                            AI 분석 시작하기
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
