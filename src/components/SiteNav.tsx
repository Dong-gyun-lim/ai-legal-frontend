import { useAuth } from '@/Lib/auth';
import { Button } from '@/components/ui/button';
import UserMenu from '@/components/UserMenu';

export default function SiteNav() {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
            <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
                <a href="/" className="font-semibold">
                    AI 이혼 상담
                </a>
                <nav className="flex items-center gap-6 text-sm text-slate-700">
                    <a href="/" className="hover:text-slate-900">
                        홈
                    </a>
                    <a href="/intake" className="hover:text-slate-900">
                        입력
                    </a>
                    <a href="/analyze" className="hover:text-slate-900">
                        분석
                    </a>
                    <a href="/report" className="hover:text-slate-900">
                        리포트
                    </a>
                </nav>

                <div className="flex items-center gap-2">
                    {user ? (
                        <UserMenu />
                    ) : (
                        <>
                            <Button href="/login" variant="outline" size="sm" className="rounded-full">
                                로그인
                            </Button>
                            <Button href="/signup" size="sm" className="rounded-full">
                                회원가입
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
