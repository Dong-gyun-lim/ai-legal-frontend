'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gavel, FileText, BarChart3, ChevronRight } from 'lucide-react';

export default function HelpMainFlowPage() {
    const [intake, setIntake] = useState<any>(null);
    const [analyze, setAnalyze] = useState<any>(null);

    useEffect(() => {
        try {
            const i = sessionStorage.getItem('intakeForm');
            const a = sessionStorage.getItem('analyzeResult');
            setIntake(i ? JSON.parse(i) : null);
            setAnalyze(a ? JSON.parse(a) : null);
        } catch {}
    }, []);

    return (
        <div className="mx-auto max-w-5xl px-5 py-10 space-y-10">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold">메인 → 입력 → 분석 → 리포트 흐름 안내</h1>
                <p className="text-slate-600 dark:text-slate-300">
                    실제 코드 흐름을 기준으로 버튼, 저장, 이동 과정을 한눈에 볼 수 있습니다.
                </p>
            </header>

            {/* 1️⃣ 메인 페이지 */}
            <Card>
                <CardHeader>
                    <CardTitle>1) 메인 화면 (Hero)</CardTitle>
                    <CardDescription>
                        “지금 상담 시작하기” → <code>/intake</code> 이동, “어떻게 동작하나요?” →{' '}
                        <code>#how-it-works</code> 스크롤
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            파일: <code>app/page.tsx</code>
                        </li>
                        <li>
                            배경 이미지: <code>public/images/hero-family.jpg</code>
                        </li>
                        <li>하단 섹션: “3단계 이용 안내” 포함</li>
                    </ul>
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href="/intake">지금 상담 시작하기</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <a href="/#how-it-works">메인 설명 보기</a>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* 2️⃣ 입력 페이지 */}
            <Card>
                <CardHeader>
                    <CardTitle>2) 입력 페이지 (/intake)</CardTitle>
                    <CardDescription>
                        제출 시 <code>sessionStorage.intakeForm</code>에 저장 후 <code>/analyze</code>로 이동
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            파일: <code>app/intake/page.tsx</code>
                        </li>
                        <li>입력 항목: 사건유형, 혼인기간, 자녀수, 사유, 자유기술 요약</li>
                        <li>
                            핵심 코드: <code>sessionStorage.setItem('intakeForm', ...)</code> →{' '}
                            <code>router.push('/analyze')</code>
                        </li>
                    </ul>
                    <div className="rounded-xl border p-4 bg-slate-50 dark:bg-slate-900/30">
                        <div className="text-sm text-slate-600 dark:text-slate-300">현재 저장된 intakeForm</div>
                        <pre className="text-xs overflow-auto max-h-48 mt-2">
                            {intake ? JSON.stringify(intake, null, 2) : '없음'}
                        </pre>
                    </div>
                    <Button asChild>
                        <Link href="/intake">입력하러 가기</Link>
                    </Button>
                </CardContent>
            </Card>

            {/* 3️⃣ 분석 페이지 */}
            <Card>
                <CardHeader>
                    <CardTitle>3) 분석 페이지 (/analyze)</CardTitle>
                    <CardDescription>
                        로그인 필요. 입력값 로드 후 Mock 분석 결과 표시 → (권장) 결과를{' '}
                        <code>sessionStorage.analyzeResult</code>에 저장
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            파일: <code>app/analyze/page.tsx</code>
                        </li>
                        <li>미로그인 시: 로그인 페이지로 이동</li>
                        <li>
                            입력값 없으면: <code>/intake</code>로 리다이렉트
                        </li>
                    </ul>
                    <div className="rounded-xl border p-4 bg-slate-50 dark:bg-slate-900/30">
                        <div className="text-sm text-slate-600 dark:text-slate-300">현재 저장된 analyzeResult</div>
                        <pre className="text-xs overflow-auto max-h-48 mt-2">
                            {analyze ? JSON.stringify(analyze, null, 2) : '없음'}
                        </pre>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href="/analyze">분석 페이지 열기</Link>
                        </Button>
                        <Button asChild variant="secondary">
                            <Link href="/report">리포트 보기</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* 4️⃣ 리포트 페이지 */}
            <Card>
                <CardHeader>
                    <CardTitle>4) 리포트 페이지 (/report)</CardTitle>
                    <CardDescription>
                        intake + analyze 결과를 바탕으로 프린트/다운로드 친화형 리포트 제공
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            파일: <code>app/report/page.tsx</code>
                        </li>
                        <li>분석 결과가 없을 경우 Mock 데이터로 대체</li>
                    </ul>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href="/intake">다시 입력</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/report">리포트 페이지 열기</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <footer className="text-sm text-slate-500">
                ※ 본 서비스는 법률 자문을 대체하지 않으며 참고용 분석 도구입니다.
            </footer>
        </div>
    );
}
