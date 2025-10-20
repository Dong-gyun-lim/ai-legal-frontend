'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { registerUser } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser(form);
      alert('회원가입 완료! 로그인 페이지로 이동합니다.');
      router.push('/login');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? '회원가입 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>아래 정보를 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input name="name" placeholder="이름" value={form.name} onChange={onChange} required />
            <Input name="email" type="email" placeholder="이메일" value={form.email} onChange={onChange} required />
            <Input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={onChange} required />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '처리 중...' : '회원가입'}
            </Button>
          </form>

          <p className="mt-4 text-sm text-center text-slate-600">
            이미 계정이 있나요?{' '}
            <a href="/login" className="text-slate-900 font-semibold hover:underline">
              로그인
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
