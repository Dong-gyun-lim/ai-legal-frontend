'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gavel, FileText, ChevronRight, ShieldCheck, BarChart3, Sparkles, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

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

            {/* Hero (배경이미지형) */}
            <section
                className="relative h-[85vh] min-h-[560px] w-full overflow-hidden"
                style={{
                    backgroundImage: "url('/images/hero-family.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* 어두운 오버레이 */}
                <div className="absolute inset-0 bg-black/50" />

                <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-5">
                    {/* ✅ motion.div 전체 애니메이션 컨테이너 */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: {
                                transition: { staggerChildren: 0.2 }, // 순차 등장
                            },
                        }}
                        className="max-w-2xl text-white"
                    >
                        {/* 1️⃣ 태그 라벨 */}
                        <motion.span
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm backdrop-blur"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M12 2l3 7h7l-5.5 4 2.5 7-7-4.5L5.5 20 8 13 2.5 9H9l3-7z"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                />
                            </svg>
                            판례 유사도 기반 상담
                        </motion.span>

                        {/* 2️⃣ 메인 헤드라인 */}
                        <motion.h1
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="mt-4 text-4xl font-bold leading-tight md:text-5xl"
                        >
                            AI와 함께하는 이혼 상담
                        </motion.h1>

                        {/* 3️⃣ 설명 문구 */}
                        <motion.p
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="mt-4 text-lg text-white/90"
                        >
                            위자료·양육권·재산분할 경향을 판례 데이터로 분석합니다.
                        </motion.p>

                        {/* 4️⃣ 버튼 그룹 */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="mt-8 flex flex-wrap items-center gap-3"
                        >
                            <a
                                href="/intake"
                                className="rounded-2xl bg-[#7B5E57] px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-[#6A4E48]"
                            >
                                지금 상담 시작하기
                            </a>
                            <Link
                                href="/help/main-flow"
                                className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 font-medium text-white/90 backdrop-blur transition hover:bg-white/20"
                            >
                                어떻게 동작하나요?
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* 하단 그라데이션 블렌딩 (다음 섹션과 자연스럽게 연결) */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
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
                            <div className="mt-3 text-xs text-slate-500">
                                데이터 출처: 대법원 사법정보시스템 공개 판례 <br />본 서비스는 법률 자문을 대체하지
                                않습니다.
                            </div>
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
        <Card className="rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
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
