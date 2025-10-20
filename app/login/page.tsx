'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginUser } from '@/lib/api';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginUser(form);
            alert('로그인 성공!');
            router.push('/');
        } catch (err) {
            setError('로그인 실패');
        }
        localStorage.setItem('user', JSON.stringify({ email: form.email }));
        router.push('/');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
                <h2 className="text-2xl font-bold text-center mb-2">로그인</h2>
                <p className="text-center text-slate-500 mb-6">이메일과 비밀번호를 입력하세요.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        name="email"
                        type="email"
                        placeholder="이메일"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        name="password"
                        type="password"
                        placeholder="비밀번호"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" className="w-full">
                        로그인
                    </Button>
                </form>

                <div className="mt-4 flex flex-col items-center gap-2 text-sm">
                    <p className="text-slate-600">
                        계정이 없으신가요?{' '}
                        <a href="/register" className="text-slate-900 hover:underline font-medium">
                            회원가입
                        </a>
                    </p>

                    {/* ✅ 추가된 영역 */}
                    <div className="flex gap-4 mt-2">
                        <a href="/find-id" className="text-slate-500 hover:text-slate-900 hover:underline">
                            아이디 찾기
                        </a>
                        <span className="text-slate-400">|</span>
                        <a href="/find-password" className="text-slate-500 hover:text-slate-900 hover:underline">
                            비밀번호 찾기
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
