import SiteNav from '@/components/SiteNav';
console.log('Landing.tsx loaded @', import.meta.url);
import { motion } from 'framer-motion';
import { Gavel, Scale, FileText, ChevronRight, ShieldCheck, BarChart3, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Landing() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
            {/* Hero 섹션: 강한 배경/테두리/패딩으로 스타일 적용 여부 확인 */}
            <section className="relative overflow-hidden bg-emerald-50 border-y-4 border-emerald-300">
                <div className="mx-auto max-w-6xl px-5 py-16 md:py-24 bg-white rounded-2xl shadow">
                    <div className="grid items-center gap-10 md:grid-cols-2">
                        {/* 기존 내용 그대로 */}

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
                                <Button href="/intake" className="rounded-2xl px-5 h-11 text-base shadow">
                                    사건 입력 시작하기 <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                                <Button href="/report" variant="outline" className="rounded-2xl px-5 h-11 text-base">
                                    샘플 리포트 보기
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
                                        <MiniBar label="위자료 분포(만원)" bars={[1200, 1600, 2100, 1800, 900]} />
                                        <MiniList
                                            title="근거 판례(Top-5)"
                                            items={[
                                                '서울가정법원 20xx느xxx',
                                                '대전가정법원 20xx느xxx',
                                                '부산가정법원 20xx느xxx',
                                                '서울가정법원 20xx드xxx',
                                                '수원가정법원 20xx르xxx',
                                            ]}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold">3단계 이용 안내</h2>
                        <p className="mt-2 text-slate-600">입력 → 분석 → 리포트. 간단한 3단계로 결과를 확인하세요.</p>
                    </div>
                    <Button href="/intake" className="rounded-2xl h-10 px-4">
                        <a>지금 시작</a>
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
                        desc="판례 Top‑k를 찾아 유사도와 참고치를 계산합니다."
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

            <section className="mx-auto max-w-6xl px-5 pb-16">
                <h3 className="text-xl md:text-2xl font-semibold">핵심 기능</h3>
                <p className="mt-2 text-slate-600">
                    정형 입력 + 자연어 요약, 판례 기반 RAG, 유사도 게이지/분포 시각화를 제공합니다.
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-3">
                    <Card className="rounded-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Gavel className="h-5 w-5" /> 이혼·양육 사건 입력
                            </CardTitle>
                            <CardDescription>React Hook Form + Zod 검증</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PlaceholderField />
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Scale className="h-5 w-5" /> 판례 유사도 분석
                            </CardTitle>
                            <CardDescription>Top‑k 근거 카드 & 색상 게이지</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3">
                                <MiniGauge label="유사도" value={72} />
                                <MiniList
                                    title="근거 판례"
                                    items={[
                                        '서울가정법원 20xx느xxx',
                                        '부산가정법원 20xx드xxx',
                                        '수원가정법원 20xx르xxx',
                                    ]}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" /> 결과 리포트
                            </CardTitle>
                            <CardDescription>PDF 미리보기/다운로드</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-xl border bg-white p-4 text-sm text-slate-600">
                                위자료 중앙값 1,800만원 · 양육권 귀속 경향 62% (모∙부 기준) · 근거 판례 5건
                            </div>
                            <div className="mt-3 flex gap-3">
                                <Button href="/report" size="sm">
                                    리포트 보기
                                </Button>
                                <Button href="/report" size="sm" variant="outline">
                                    PDF 다운로드
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

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

function StepCard({
    index,
    title,
    desc,
    icon,
    href,
}: {
    index: number;
    title: string;
    desc: string;
    icon: React.ReactNode;
    href: string;
}) {
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
    return (
        <div className="rounded-xl border p-4">
            <div className="text-sm text-slate-600 mb-2">{label}</div>
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
            </div>
            <div className="mt-1 text-right text-xs text-slate-500">{value}%</div>
        </div>
    );
}

function MiniBar({ label, bars }: { label: string; bars: number[] }) {
    const max = Math.max(...bars);
    return (
        <div className="rounded-xl border p-4">
            <div className="text-sm text-slate-600 mb-2">{label}</div>
            <div className="flex items-end gap-2 h-24">
                {bars.map((b, i) => (
                    <div
                        key={i}
                        className="flex-1 rounded-t bg-slate-900/80"
                        style={{ height: `${(b / max) * 100}%` }}
                    />
                ))}
            </div>
            <div className="mt-1 text-xs text-slate-500">샘플 데이터</div>
        </div>
    );
}

function MiniList({ title, items }: { title: string; items: string[] }) {
    return (
        <div className="rounded-xl border p-4">
            <div className="text-sm text-slate-600 mb-2">{title}</div>
            <ul className="space-y-2 text-sm">
                {items.map((t, i) => (
                    <li key={i} className="flex items-center justify-between">
                        <span className="truncate pr-2">{t}</span>
                        <a
                            className="text-slate-500 hover:text-slate-900 inline-flex items-center text-xs"
                            href="/analyze"
                        >
                            보기 <ChevronRight className="ml-1 h-3 w-3" />
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function PlaceholderField() {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <Input placeholder="혼인기간(년)" />
                <Input placeholder="자녀 수" />
            </div>
            <Input placeholder="주요 사유 (예: 외도, 폭행, 경제적 학대)" />
            <Input placeholder="사건 요약 (자연어)" />
            <div className="pt-1">
                <Button href="/intake" size="sm" className="rounded-xl">
                    입력 계속하기
                </Button>
            </div>
        </div>
    );
}
