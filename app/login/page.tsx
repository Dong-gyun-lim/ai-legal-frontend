'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginUser } from '@/lib/api';
import { toast } from 'sonner'; // ✅ 추가

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 🔹 로그인 API 호출
            await loginUser(form);

            // 🔹 유저 정보 저장
            localStorage.setItem('user', JSON.stringify({ email: form.email }));

            // ✅ 성공 토스트
            toast.success('로그인 성공 🎉', {
                description: '다시 오신 걸 환영합니다!',
            });

            // ✅ 라우터 이동 (약간의 지연으로 자연스러운 UX)
            setTimeout(() => router.push('/'), 600);
        } catch (err) {
            console.error(err);

            // ❌ 실패 토스트
            toast.error('로그인 실패', {
                description: '이메일 또는 비밀번호를 확인해주세요.',
            });
        } finally {
            setLoading(false);
        }
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
                        disabled={loading}
                    />
                    <Input
                        name="password"
                        type="password"
                        placeholder="비밀번호"
                        value={form.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? '로그인 중...' : '로그인'}
                    </Button>
                </form>

                <div className="mt-4 flex flex-col items-center gap-2 text-sm">
                    <p className="text-slate-600">
                        계정이 없으신가요?{' '}
                        <a href="/register" className="text-slate-900 hover:underline font-medium">
                            회원가입
                        </a>
                    </p>

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
