'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Gavel, Scale, AlertTriangle } from 'lucide-react';
import GuestModal from '@/components/GuestModal';
import { toast } from 'sonner';

type AnalyzeResult = {
    similarity: number;
    damages: number;
    custody: string;
    cases: Array<{ court: string; caseNo: string; title: string; key?: string }>;
};

export default function ReportPage() {
    const router = useRouter();

    // 인증/접근 상태
    const [authReady, setAuthReady] = useState(false); // 분석/리포트 진행 가능 상태
    const [asGuest, setAsGuest] = useState(false); // 비회원 여부
    const [user, setUser] = useState<any>(null); // 로그인 사용자

    // 모달 단계
    const [showFirst, setShowFirst] = useState(false); // 1차: 로그인/비회원 선택 모달
    const [showConfirm, setShowConfirm] = useState(false); // 2차: 비회원 저장안내 확인 모달

    // 경고 배너 (비회원 선택 직후 안내)
    const [showGuestWarn, setShowGuestWarn] = useState(false);

    // 리포트 데이터
    const [report, setReport] = useState<{ intake: any; analyze: AnalyzeResult } | null>(null);

    /* 1) 로그인 or 비회원 선택 확인 */
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
            setShowGuestWarn(true);
        } else {
            setShowFirst(true); // 아무 것도 없으면 1차 모달
        }
    }, []);

    /* 1-1) 1차 모달(GuestModal)에서 비회원 계속 → 2차 확인 모달 */
    const handleGuestFirst = () => {
        setShowFirst(false);
        setShowConfirm(true);
    };
    /* 1-2) 2차 확인 모달에서 동의 */
    const handleGuestConfirm = () => {
        localStorage.setItem('guest', 'yes');
        setAsGuest(true);
        setShowConfirm(false);
        setAuthReady(true);
        setShowGuestWarn(true);
        toast.warning('비회원 모드로 진행됩니다. 일부 데이터는 저장되지 않습니다.');
    };
    /* 1-3) 2차 확인 모달에서 취소 → 1차 모달 복귀 */
    const handleGuestCancel = () => {
        setShowConfirm(false);
        setShowFirst(true);
    };

    /* 2) authReady 이후: 세션에서 intake/analyze 읽기 (없으면 mock) */
    useEffect(() => {
        if (!authReady) return;

        const intakeRaw = sessionStorage.getItem('intakeForm');
        const analyzeRaw = sessionStorage.getItem('analyzeResult');
        const intake = intakeRaw ? JSON.parse(intakeRaw) : null;

        if (!intake) {
            toast.error('입력된 사건 정보가 없습니다. 먼저 정보를 입력해 주세요.');
            router.push('/intake');
            return;
        }

        const analyze: AnalyzeResult = analyzeRaw
            ? JSON.parse(analyzeRaw)
            : {
                  similarity: 83,
                  damages: 1800,
                  custody: '모(母)',
                  cases: [
                      {
                          court: '서울가정법원',
                          caseNo: '2022드단12345',
                          title: `[${intake.reason || '사유'}] 관련 판례`,
                          key: '혼인파탄 책임 가중',
                      },
                      { court: '부산가정법원', caseNo: '2021드단55667', title: '양육권 분쟁', key: '양육환경 안정성' },
                  ],
              };

        setReport({ intake, analyze });

        // ⚠️ 비회원은 저장 금지(혹시 남아있던 값도 제거)
        if (asGuest) {
            sessionStorage.removeItem('analyzeResult');
        }
    }, [authReady, asGuest, router]);

    /* 모달 표시 */
    if (showFirst) {
        return <GuestModal onContinueAsGuest={handleGuestFirst} onGoLogin={() => router.push('/login')} />;
    }
    if (showConfirm) {
        return <ConfirmGuestModalInline onConfirm={handleGuestConfirm} onCancel={handleGuestCancel} />;
    }

    /* 로딩 */
    if (!report) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-500">
                리포트 준비 중입니다... 📄
            </div>
        );
    }

    /* 본문 */
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-4xl pt-10 px-4">
                {/* 로그인 상태 라벨 (분석 페이지와 동일 문구) */}
                <div className="text-right text-sm text-slate-600 mb-4">
                    로그인 상태:{' '}
                    <span className="font-semibold">{user?.email ?? (asGuest ? '비회원' : '확인 중...')}</span>
                </div>

                {/* 비회원 경고 배너 */}
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
            </div>

            <div className="mx-auto max-w-3xl py-6 px-4">
                <h1 className="text-3xl font-bold text-center mb-6">AI 분석 리포트</h1>

                {/* 요약 카드 */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>핵심 요약</CardTitle>
                        <CardDescription>AI 분석 결과 요약</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                        <SummaryItem icon={<BarChart3 />} label="유사도" value={`${report.analyze.similarity}%`} />
                        <SummaryItem icon={<Scale />} label="위자료 중앙값" value={`${report.analyze.damages}만원`} />
                        <SummaryItem icon={<Gavel />} label="양육권 귀속" value={report.analyze.custody} />
                    </CardContent>
                </Card>

                {/* 입력 정보 */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>입력 사건 정보</CardTitle>
                        <CardDescription>사용자가 입력한 사건 요약</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-700 space-y-2">
                        <div>
                            <span className="font-medium">제목:</span> {report.intake.title || '-'}
                        </div>
                        <div>
                            <span className="font-medium">주요 사유:</span> {report.intake.reason || '-'}
                        </div>
                        <div className="whitespace-pre-line">
                            <span className="font-medium">요약:</span> {report.intake.summary || '-'}
                        </div>
                    </CardContent>
                </Card>

                {/* 근거 판례 */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>근거 판례 (Top-2)</CardTitle>
                        <CardDescription>AI가 분석한 주요 참조 판례</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="divide-y divide-slate-200">
                            {report.analyze.cases.map((c, i) => (
                                <li key={i} className="py-3">
                                    <div className="font-medium">{c.title}</div>
                                    <div className="text-sm text-slate-500">
                                        {c.court} · {c.caseNo}
                                    </div>
                                    {c.key && <div className="text-sm mt-1 text-slate-700">요점: {c.key}</div>}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* 버튼 */}
                <div className="mt-8 flex justify-center gap-3">
                    <Button onClick={() => window.print()}>PDF 저장 / 인쇄</Button>
                    <Button variant="outline" asChild>
                        <a href="/analyze">분석 다시 보기</a>
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* ------------------- 요약 카드 ------------------- */
function SummaryItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="rounded-lg border bg-white p-4 text-center">
            <div className="flex justify-center mb-2 text-slate-700">{icon}</div>
            <div className="text-xs text-slate-500">{label}</div>
            <div className="text-lg font-semibold">{value}</div>
        </div>
    );
}

/* ------------------- 인라인 2차 확인 모달 ------------------- */
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
