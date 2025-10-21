'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gavel, FileText, ChevronRight, ShieldCheck, BarChart3, Sparkles, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

type SimilarCase = {
    id: number;
    court: string;
    caseNo: string;
    date: string;
    title: string;
    similarity: number;
};

export default function Landing() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
            {/* 🔹 전역 SiteNav는 app/layout.tsx 에서 렌더됩니다. 여기선 제거 */}

            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-white" />
                <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
                    <div className="grid items-center gap-10 md:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-slate-600 bg-white shadow-sm">
                                <Sparkles className="h-4 w-4" /> AI 기반 판례 유사도 분석
                            </span>
                            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
                                이혼·양육 분쟁, <span className="text-slate-600">판례 기반</span>으로
                                <span className="block">빠르게 흐름을 파악하세요</span>
                            </h1>
                            <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed">
                                사건 정보를 입력하면 유사한 판례를 찾아 유사도 게이지와 위자료·양육권 경향을
                                시각화합니다. 본 서비스는 법률 자문을 대체하지 않으며 참고용 정보를 제공합니다.
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <Button asChild className="rounded-2xl px-5 h-11 text-base shadow">
                                    <a href="/intake" className="inline-flex items-center">
                                        사건 입력 시작하기 <ChevronRight className="ml-1 h-4 w-4" />
                                    </a>
                                </Button>
                                <Button variant="outline" asChild className="rounded-2xl px-5 h-11 text-base">
                                    <a href="/report" className="inline-flex items-center">
                                        샘플 리포트 보기
                                    </a>
                                </Button>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                <span className="inline-flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4" /> 개인정보는 안전하게 처리됩니다
                                </span>
                                <span className="hidden md:inline">·</span>
                                <span>법률 자문이 아닌 참고형 안내</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <Card className="rounded-2xl border-slate-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl">분석 미리보기</CardTitle>
                                    <CardDescription>유사도, 위자료 분포, 양육권 경향을 한눈에</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <MiniGauge label="유사도" value={78} />
                                        <MiniGauge label="양육권 귀속 경향" value={62} />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3단계 이용 안내 */}
            <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold">3단계 이용 안내</h2>
                        <p className="mt-2 text-slate-600">입력 → 분석 → 리포트. 간단한 3단계로 결과를 확인하세요.</p>
                    </div>
                    <Button asChild className="rounded-2xl h-10 px-4">
                        <a href="/intake">지금 시작</a>
                    </Button>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    <StepCard
                        index={1}
                        title="사건 정보 입력"
                        desc="기본 정보와 사건 요약을 입력하면 AI가 정규화합니다."
                        icon={<Gavel className="h-6 w-6" />}
                        href="/intake"
                    />
                    <StepCard
                        index={2}
                        title="유사도 분석"
                        desc="판례 Top-k를 찾아 유사도와 참고치를 계산합니다."
                        icon={<BarChart3 className="h-6 w-6" />}
                        href="/analyze"
                    />
                    <StepCard
                        index={3}
                        title="리포트 확인"
                        desc="핵심 지표와 근거 판례를 요약한 보고서를 저장/공유합니다."
                        icon={<FileText className="h-6 w-6" />}
                        href="/report"
                    />
                </div>
            </section>

            {/* 최근 비슷한 판례 */}
            <section className="mx-auto max-w-6xl px-5 pb-16">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h3 className="text-xl md:text-2xl font-semibold">최근 비슷한 판례</h3>
                        <p className="mt-2 text-slate-600">입력 키워드 기준으로 최신·유사도 순으로 보여줍니다.</p>
                    </div>
                    <SimilarSearch />
                </div>

                <SimilarCasesList />
            </section>

            {/* Footer */}
            <footer className="border-t bg-white">
                <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-slate-600">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <div className="font-semibold">AI 이혼 분쟁 상담 플랫폼</div>
                            <div className="mt-1">학습용·참고용 서비스 · 법률 자문 아님</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <a className="hover:underline" href="/intake">
                                시작하기
                            </a>
                            <a className="hover:underline" href="/analyze">
                                분석
                            </a>
                            <a className="hover:underline" href="/report">
                                리포트
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

/* -------------------- 하단 구성요소 -------------------- */

interface StepCardProps {
    index: number;
    title: string;
    desc: string;
    icon: React.ReactNode;
    href: string;
}
function StepCard({ index, title, desc, icon, href }: StepCardProps) {
    return (
        <Card className="rounded-2xl hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">
                            {index}
                        </div>
                        <div className="text-slate-900">{icon}</div>
                    </div>
                    <a href={href} className="text-slate-500 hover:text-slate-900 text-sm inline-flex items-center">
                        바로가기 <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                </div>
                <h4 className="mt-4 text-lg font-semibold">{title}</h4>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">{desc}</p>
            </CardContent>
        </Card>
    );
}

function MiniGauge({ label, value }: { label: string; value: number }) {
    const color = value >= 70 ? 'bg-emerald-500' : value >= 40 ? 'bg-amber-500' : 'bg-rose-500';
    const v = Math.max(0, Math.min(100, value));
    return (
        <div className="rounded-xl border p-4">
            <div className="text-sm text-slate-600 mb-2">{label}</div>
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${v}%` }} />
            </div>
            <div className="mt-1 text-right text-xs text-slate-500">{v}%</div>
        </div>
    );
}

/* ✅ 최근 비슷한 판례 */
function SimilarSearch() {
    const [q, setQ] = useState('');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('similar:search', { detail: { q } }));
    };

    return (
        <form onSubmit={onSubmit} className="relative w-full max-w-sm">
            <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="키워드 검색 (예: 위자료, 양육권)"
                className="pl-9"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Button
                type="submit"
                variant="outline"
                className="absolute right-0 top-1/2 -translate-y-1/2 h-8 px-3 mr-1 hidden md:inline-flex"
            >
                검색
            </Button>
        </form>
    );
}

function SimilarCasesList() {
    const [items, setItems] = useState<SimilarCase[]>([]);
    const [q, setQ] = useState('');

    useEffect(() => {
        const handler = (e: any) => setQ(e.detail?.q ?? '');
        window.addEventListener('similar:search', handler as any);
        return () => window.removeEventListener('similar:search', handler as any);
    }, []);

    useEffect(() => {
        // TODO: fetch(`/api/cases/similar?q=${encodeURIComponent(q)}`)
        setItems([
            {
                id: 1,
                court: '서울가정법원',
                caseNo: '2022드단12345',
                date: '2022-11-03',
                title: '위자료 및 친권자 지정',
                similarity: 82,
            },
            {
                id: 2,
                court: '부산가정법원',
                caseNo: '2021드단55667',
                date: '2021-09-15',
                title: '재산분할과 양육비 산정',
                similarity: 77,
            },
            {
                id: 3,
                court: '대구가정법원',
                caseNo: '2020느단99887',
                date: '2020-06-28',
                title: '양육권 변경 청구',
                similarity: 74,
            },
        ]);
    }, [q]);

    return (
        <div className="mt-6 grid gap-5 md:grid-cols-3">
            {items.map((it) => (
                <a
                    key={it.id}
                    href={`/analyze?case=${it.id}`}
                    className="rounded-2xl border hover:shadow-md bg-white transition-shadow"
                >
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-slate-900 line-clamp-2">{it.title}</div>
                            <span className="text-xs text-slate-500">{it.date}</span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                            {it.court} · {it.caseNo}
                        </div>
                        <div className="mt-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-600">유사도</span>
                                <span className="tabular-nums text-slate-700">{it.similarity}%</span>
                            </div>
                            <div className="mt-1 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                <div
                                    className={`h-full ${
                                        it.similarity >= 70
                                            ? 'bg-emerald-500'
                                            : it.similarity >= 40
                                            ? 'bg-amber-500'
                                            : 'bg-rose-500'
                                    }`}
                                    style={{ width: `${Math.max(0, Math.min(100, it.similarity))}%` }}
                                />
                            </div>
                        </div>
                        <div className="mt-3 inline-flex items-center text-xs text-slate-600">
                            자세히 보기 <ChevronRight className="ml-1 h-3 w-3" />
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
}
