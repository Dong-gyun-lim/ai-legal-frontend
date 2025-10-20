import { useState } from 'react';
import { useAuth } from '@/Lib/auth';
import { signIn } from '@/api/auth.api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr('');
        setLoading(true);
        try {
            const { user, token } = await signIn(email, pw);
            login(user, token);
            location.href = '/'; // 로그인 후 홈으로
        } catch (e: any) {
            setErr(e?.message ?? '로그인 실패');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="mx-auto max-w-md p-6">
            <h1 className="text-2xl font-semibold mb-4">로그인</h1>
            <form onSubmit={onSubmit} className="space-y-3">
                <Input placeholder="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input placeholder="비밀번호" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
                {err && <p className="text-sm text-red-600">{err}</p>}
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? '진행중...' : '로그인'}
                </Button>
            </form>
            <p className="mt-3 text-sm text-slate-600">
                계정이 없으신가요?{' '}
                <a href="/signup" className="text-slate-900 underline">
                    회원가입
                </a>
            </p>
        </main>
    );
}
