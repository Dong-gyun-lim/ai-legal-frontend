'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, Gavel, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/* ======================= 메인 페이지 ======================= */
export default function AnalyzePage() {
    const router = useRouter();
    const [result, setResult] = useState<any>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // ✅ 로그인 상태 확인
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (!storedUser) {
            toast.error('로그인이 필요합니다.');
            router.push('/login');
            return;
        }
        setUser(JSON.parse(storedUser));

        // ✅ 입력 데이터 확인
        const raw = sessionStorage.getItem('intakeForm');
        const intake = raw ? JSON.parse(raw) : null;
        if (!intake) {
            toast.error('입력된 사건 정보가 없습니다. 먼저 정보를 입력해 주세요.');
            router.push('/intake');
            return;
        }

        // ✅ Mock 분석 결과 (나중에 백엔드 연결 예정)
        const t = setTimeout(() => {
            setResult({
                similarity: 83,
                damages: 1800,
                custody: '모(母)',
                cases: [
                    {
                        court: '서울가정법원',
                        caseNo: '2022드단12345',
                        title: `[${intake.reason || '사유'}] 관련 판례`,
                        similarity: 91,
                    },
                    { court: '부산가정법원', caseNo: '2021드단55667', title: '유사 사실관계 판례', similarity: 85 },
                ],
                intake,
            });
        }, 400);

        return () => clearTimeout(t);
    }, [router]);

    if (!user) return null; // 로그인 안됐을 때 렌더 중단
    if (!result)
        return <div className="flex min-h-screen items-center justify-center text-slate-500">분석 중입니다... 🔍</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-4xl py-12 px-4">
                <h1 className="text-3xl font-bold mb-6 text-center">AI 판례 분석 결과</h1>

                {/* 사용자 정보 */}
                <div className="text-right text-sm text-slate-600 mb-4">
                    로그인: <span className="font-semibold">{user.email}</span>
                </div>

                {/* 주요 지표 */}
                <div className="grid gap-5 md:grid-cols-3 mb-8">
                    <StatCard icon={<BarChart3 className="h-6 w-6" />} label="유사도" value={`${result.similarity}%`} />
                    <StatCard
                        icon={<Scale className="h-6 w-6" />}
                        label="위자료 중앙값"
                        value={`${result.damages}만원`}
                    />
                    <StatCard icon={<Gavel className="h-6 w-6" />} label="양육권 귀속" value={result.custody} />
                </div>

                {/* ✅ NEW: AI 해석 요약 패널 (빨간 영역 채우기) */}
                <InsightPanel />

                {/* 근거 판례 */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>근거 판례</CardTitle>
                        <CardDescription>가장 유사한 판례 목록 (Top-2)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="divide-y divide-slate-200">
                            {result.cases.map((c: any, i: number) => (
                                <li key={i} className="py-3 flex justify-between">
                                    <div>
                                        <div className="font-medium">{c.title}</div>
                                        <div className="text-sm text-slate-500">
                                            {c.court} · {c.caseNo}
                                        </div>
                                    </div>
                                    <div className="text-sm text-slate-600">{c.similarity}%</div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* 버튼 영역 */}
                <div className="mt-8 flex justify-center gap-3">
                    <Button asChild>
                        <a href="/report">리포트 보기</a>
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/intake')}>
                        다시 입력
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* ======================= NEW: AI 해석 요약 패널 ======================= */

const AI_URL = process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:5001';

type IntakeForm = {
    title?: string;
    reason?: string;
    summary?: string;
    gender?: 'male' | 'female' | '';
    ageRange?: '20s' | '30s' | '40s' | '50plus' | '';
    marriageYears?: number;
    childCount?: number;
    reasons?: string[];
    otherReason?: string;
    role?: 'victim' | 'perpetrator' | 'both' | '';
    claimDamages?: boolean;
    claimCustody?: boolean; // 자녀 0이면 없을 수 있음
    incidentYear?: string;
    wantWinProbability?: boolean;
};

function InsightPanel() {
    const [intake, setIntake] = useState<IntakeForm | null>(null);
    const [text, setText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [err, setErr] = useState<string>('');

    // 세션에서 intakeForm 복원
    useEffect(() => {
        try {
            const raw = sessionStorage.getItem('intakeForm');
            if (raw) setIntake(JSON.parse(raw));
        } catch {
            /* noop */
        }
    }, []);

    // 프롬프트 생성 (입력값 요약)
    const question = useMemo(() => {
        if (!intake) return '';
        const meta = [
            intake.gender ? `성별=${intake.gender}` : '',
            intake.ageRange ? `나이대=${intake.ageRange}` : '',
            Number.isFinite(intake.marriageYears) ? `혼인기간=${intake.marriageYears}년` : '',
            Number.isFinite(intake.childCount) ? `자녀수=${intake.childCount}` : '',
            intake.incidentYear ? `사건연도=${intake.incidentYear}` : '',
            intake.role ? `역할=${intake.role}` : '',
            intake.claimDamages ? '위자료청구=예' : '위자료청구=아니오',
            typeof intake.claimCustody === 'boolean' ? `양육권청구=${intake.claimCustody ? '예' : '아니오'}` : '',
            intake.reasons?.length ? `사유태그=${intake.reasons.join(',')}` : '',
            intake.otherReason ? `기타=${intake.otherReason}` : '',
            intake.wantWinProbability ? '승소여부예측=요청' : '승소여부예측=미요청',
        ]
            .filter(Boolean)
            .join(' | ');

        return [
            '사용자 입력을 바탕으로 한국어로 간단·보수적으로 사건 해석 요약을 작성하세요.',
            '1) 위자료/양육/재산분할 경향 (근거 2~4개)',
            intake.wantWinProbability ? '2) 승소 가능성 관점(확률 수치 금지, 표현 절제)' : '',
            '3) 유의 쟁점 2가지',
            '4) 본 서비스는 법률 자문이 아님을 한 줄로 고지',
            '',
            `메타: ${meta}`,
            '',
            '응답 형식:',
            '- 요약 한 문장',
            '- 근거 포인트',
            intake.wantWinProbability ? '- 승소 가능성 관점' : '',
            '- 유의 쟁점',
            '- 한줄 고지',
        ]
            .filter(Boolean)
            .join('\n');
    }, [intake]);

    // AI 호출
    useEffect(() => {
        let ignore = false;
        const run = async () => {
            if (!question) return;
            setLoading(true);
            setErr('');
            try {
                const res = await fetch(`${AI_URL}/rag`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question, top_k: 5 }),
                });
                if (!res.ok) throw new Error(`AI 서버 오류 (${res.status})`);
                const data = await res.json();
                if (!ignore) setText(String(data?.answer || '').trim());
            } catch (e: any) {
                if (!ignore) setErr(e?.message || 'AI 분석 중 문제가 발생했습니다.');
            } finally {
                if (!ignore) setLoading(false);
            }
        };
        run();
        return () => {
            ignore = true;
        };
    }, [question]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI 해석 요약</CardTitle>
                <CardDescription>입력한 사건 정보를 바탕으로 자동 생성된 요약입니다.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="space-y-2 text-sm text-slate-500">
                        <div className="h-4 w-1/3 bg-slate-200 animate-pulse rounded" />
                        <div className="h-4 w-5/6 bg-slate-200 animate-pulse rounded" />
                        <div className="h-4 w-2/3 bg-slate-200 animate-pulse rounded" />
                    </div>
                )}
                {!loading && err && <p className="text-sm text-red-600">⚠️ {err}</p>}
                {!loading && !err && (
                    <div className="prose prose-slate max-w-none text-sm whitespace-pre-wrap leading-7">
                        {text || '아직 생성된 요약이 없습니다.'}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

/* ======================= 네비게이션 ======================= */
function SiteNav({ user, setUser }: { user: any; setUser: any }) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <div className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-2xl bg-slate-900" />
                    <span className="font-bold tracking-tight">DivorceInsight</span>
                </div>

                <nav className="hidden items-center gap-6 text-sm md:flex">
                    <a className="hover:text-slate-900 text-slate-600" href="/">
                        홈
                    </a>
                    <a className="hover:text-slate-900 text-slate-600" href="/intake">
                        입력
                    </a>
                    <a className="hover:text-slate-900 text-slate-600" href="/analyze">
                        분석
                    </a>
                    <a className="hover:text-slate-900 text-slate-600" href="/report">
                        리포트
                    </a>
                </nav>

                {/* 로그인 / 로그아웃 상태 */}
                <div className="flex items-center gap-2">
                    {user ? (
                        <>
                            <span className="text-sm text-slate-600 hidden md:inline">{user.email}</span>
                            <Button variant="outline" onClick={handleLogout}>
                                로그아웃
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button asChild variant="outline">
                                <a href="/login">로그인</a>
                            </Button>
                            <Button asChild>
                                <a href="/register">회원가입</a>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ======================= 통계 카드 ======================= */
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <Card className="text-center">
            <CardContent className="p-6">
                <div className="flex justify-center mb-2">{icon}</div>
                <div className="text-sm text-slate-500">{label}</div>
                <div className="text-lg font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}
