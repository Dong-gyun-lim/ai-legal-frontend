'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Gavel, Scale, AlertTriangle } from 'lucide-react';
import GuestModal from '@/components/GuestModal';
import { toast } from 'sonner';

/** ======================= Analyze Page (로그인/비회원 선택 + 분석 + AI 요약) ======================= */
export default function AnalyzePage() {
    const router = useRouter();

    // 인증/접근 상태
    const [authReady, setAuthReady] = useState(false); // 분석 진행 가능 상태
    const [asGuest, setAsGuest] = useState(false); // 비회원 여부
    const [user, setUser] = useState<any>(null); // 로그인 사용자

    // 모달 단계
    const [showFirst, setShowFirst] = useState(false); // 1차: 로그인/비회원 선택 모달
    const [showConfirm, setShowConfirm] = useState(false); // 2차: 비회원 저장안내 확인 모달

    // 경고 배너 (비회원 선택 직후 안내)
    const [showGuestWarn, setShowGuestWarn] = useState(false);

    // 분석/표시 데이터
    const [result, setResult] = useState<{
        similarity: number;
        damages: number;
        custody: string;
        cases: Array<{ court: string; caseNo: string; title: string; similarity: number }>;
    } | null>(null);

    // --- 1) 로그인 or 비회원 선택 확인 ---
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const storedUser = localStorage.getItem('user');
        const guestFlag = localStorage.getItem('guest');

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {}
            setAuthReady(true);
        } else if (guestFlag === 'yes') {
            setAsGuest(true);
            setAuthReady(true);
            setShowGuestWarn(true); // 비회원 경고 띄우기
        } else {
            // 아무 것도 없으면 1차 모달 노출
            setShowFirst(true);
        }
    }, []);

    // --- 1-1) 1차 모달(GuestModal) 액션: 비회원 계속 -> 2차 확인 모달 열기 ---
    const handleGuestFirst = () => {
        setShowFirst(false);
        setShowConfirm(true);
    };
    // --- 1-2) 2차 확인 모달에서 동의 ---
    const handleGuestConfirm = () => {
        localStorage.setItem('guest', 'yes');
        setAsGuest(true);
        setShowConfirm(false);
        setAuthReady(true);
        setShowGuestWarn(true);
        toast.warning('비회원 모드로 진행됩니다. 일부 데이터는 저장되지 않습니다.');
    };
    // --- 1-3) 2차 확인 모달에서 취소 -> 1차 모달로 복귀 ---
    const handleGuestCancel = () => {
        setShowConfirm(false);
        setShowFirst(true);
    };

    // --- 2) authReady 이후: intakeForm 확인 + mock 분석 결과 로드 ---
    useEffect(() => {
        if (!authReady) return;

        const raw = sessionStorage.getItem('intakeForm');
        const intake = raw ? JSON.parse(raw) : null;

        if (!intake) {
            toast.error('입력된 사건 정보가 없습니다. 먼저 정보를 입력해 주세요.');
            router.push('/intake');
            return;
        }

        // ✅ 실제 백엔드 연동 전까지는 mock
        const t = setTimeout(() => {
            const mock = {
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
            };
            setResult(mock);

            // ✅ 비회원은 저장 금지 (남아있던 값도 제거)
            if (asGuest) {
                sessionStorage.removeItem('analyzeResult');
            } else {
                // 로그인 유저만 저장 → Report에서 재사용
                sessionStorage.setItem(
                    'analyzeResult',
                    JSON.stringify({
                        similarity: mock.similarity,
                        damages: mock.damages,
                        custody: mock.custody,
                        cases: [
                            {
                                court: mock.cases[0].court,
                                caseNo: mock.cases[0].caseNo,
                                title: mock.cases[0].title,
                                key: '혼인파탄 책임 가중',
                            },
                            {
                                court: mock.cases[1].court,
                                caseNo: mock.cases[1].caseNo,
                                title: mock.cases[1].title,
                                key: '양육환경 안정성',
                            },
                        ],
                    })
                );
            }
        }, 500);

        return () => clearTimeout(t);
    }, [authReady, asGuest, router]);

    // --- 모달 표시 ---
    if (showFirst) {
        return <GuestModal onContinueAsGuest={handleGuestFirst} onGoLogin={() => router.push('/login')} />;
    }
    if (showConfirm) {
        return <ConfirmGuestModalInline onConfirm={handleGuestConfirm} onCancel={handleGuestCancel} />;
    }

    // --- 3) 렌더 ---
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            <div className="mx-auto max-w-4xl py-12 px-4">
                {/* 상단 사용자 표시 */}
                <div className="text-right text-sm text-slate-600 mb-4">
                    로그인 상태:{' '}
                    <span className="font-semibold">{user?.email ?? (asGuest ? '비회원' : '확인 중...')}</span>
                </div>

                {/* 비회원 경고 배너 (선택 표시) */}
                {asGuest && showGuestWarn && (
                    <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800 flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
                        <div className="text-sm">
                            <b>비회원 모드</b>로 진행 중입니다. 리포트/분석 결과 등 일부 데이터가 저장되지 않습니다.
                            <div className="mt-1">
                                <button className="underline" onClick={() => setShowGuestWarn(false)}>
                                    알림 닫기
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 본문 */}
                {!result ? (
                    <div className="flex h-[40vh] items-center justify-center text-slate-500">🔍 분석 중입니다...</div>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold mb-6 text-center">AI 판례 분석 결과</h1>

                        {/* 주요 지표 */}
                        <div className="grid gap-5 md:grid-cols-3 mb-8">
                            <StatCard
                                icon={<BarChart3 className="h-6 w-6" />}
                                label="유사도"
                                value={`${result.similarity}%`}
                            />
                            <StatCard
                                icon={<Scale className="h-6 w-6" />}
                                label="위자료 중앙값"
                                value={`${result.damages}만원`}
                            />
                            <StatCard icon={<Gavel className="h-6 w-6" />} label="양육권 귀속" value={result.custody} />
                        </div>

                        {/* 🔎 AI 해석 요약 (입력 기반 LLM 요약) */}
                        <InsightPanel />

                        {/* 근거 판례 */}
                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle>근거 판례</CardTitle>
                                <CardDescription>가장 유사한 판례 목록 (Top-2)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="divide-y divide-slate-200">
                                    {result.cases.map((c, i) => (
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

                        {/* 버튼 */}
                        <div className="mt-8 flex justify-center gap-3">
                            <Button asChild>
                                <a href="/report">리포트 보기</a>
                            </Button>
                            <Button variant="outline" onClick={() => router.push('/intake')}>
                                다시 입력
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

/** ======================= 통계 카드 ======================= */
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

/** ======================= AI 해석 요약 패널 ======================= */
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
    claimCustody?: boolean;
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

    // 프롬프트 생성
    const question = useMemo(() => {
        if (!intake) return '';
        const meta = [
            intake.gender ? `성별=${intake.gender}` : '',
            intake.ageRange ? `나이대=${intake.ageRange}` : '',
            Number.isFinite(intake.marriageYears) ? `혼인기간=${intake.marriageYears}년` : '',
            Number.isFinite(intake.childCount) ? `자녀수=${intake.childCount}` : '',
            intake.incidentYear ? `사건연도=${intake.incidentYear}` : '',
            intake.role ? `역할=${intake.role}` : '',
            typeof intake.claimDamages === 'boolean' ? `위자료청구=${intake.claimDamages ? '예' : '아니오'}` : '',
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
            if (!question) return; // intake 없으면 호출 안 함
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

/** ======================= 인라인 2차 확인 모달 ======================= */
function ConfirmGuestModalInline({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <h2 className="text-lg font-semibold">비회원으로 계속하시겠습니까?</h2>
                <p className="mt-2 text-sm text-slate-600">
                    비회원 모드에서는 <b>분석 결과/리포트가 저장되지 않습니다.</b> 필요 시 나중에 로그인을 선택할 수
                    있습니다.
                </p>
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="outline" onClick={onCancel}>
                        취소
                    </Button>
                    <Button onClick={onConfirm}>비회원으로 진행</Button>
                </div>
            </div>
        </div>
    );
}
