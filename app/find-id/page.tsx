'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function FindIdPage() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.error(`아이디 찾기 요청이 전송되었습니다. (입력한 이메일: ${email})`);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
                <h2 className="text-2xl font-bold text-center mb-2">아이디 찾기</h2>
                <p className="text-center text-slate-500 mb-6">회원가입 시 입력한 이메일을 입력하세요.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="email"
                        placeholder="이메일 주소"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button type="submit" className="w-full">
                        아이디 찾기
                    </Button>
                </form>
            </div>
        </div>
    );
}
