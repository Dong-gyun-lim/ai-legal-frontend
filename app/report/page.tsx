'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Gavel, Scale, FileText } from 'lucide-react';

export default function ReportPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    // ✅ 로그인 확인
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!storedUser) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));

    // ✅ intake + analyze 결과 불러오기
    const intakeRaw = sessionStorage.getItem('intakeForm');
    const analyzeRaw = sessionStorage.getItem('analyzeResult'); // 나중에 실제 분석 결과 저장할 때 사용
    const intake = intakeRaw ? JSON.parse(intakeRaw) : null;

    if (!intake) {
      alert('입력된 사건 정보가 없습니다.');
      router.push('/intake');
      return;
    }

    // Mock 데이터 생성 (나중엔 analyze 페이지에서 저장하도록)
    const mockAnalyze = analyzeRaw
      ? JSON.parse(analyzeRaw)
      : {
          similarity: 83,
          damages: 1800,
          custody: '모(母)',
          cases: [
            { court: '서울가정법원', caseNo: '2022드단12345', title: `[${intake.reason}] 관련 판례`, key: '혼인파탄 책임 가중' },
            { court: '부산가정법원', caseNo: '2021드단55667', title: '양육권 분쟁', key: '양육환경 안정성' },
          ],
        };

    setReport({
      intake,
      analyze: mockAnalyze,
    });
  }, [router]);

  if (!report)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        리포트 준비 중입니다... 📄
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNav user={user} />

      <div className="mx-auto max-w-3xl py-12 px-4">
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
            <div><span className="font-medium">제목:</span> {report.intake.title || '-'}</div>
            <div><span className="font-medium">주요 사유:</span> {report.intake.reason || '-'}</div>
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
              {report.analyze.cases.map((c: any, i: number) => (
                <li key={i} className="py-3">
                  <div className="font-medium">{c.title}</div>
                  <div className="text-sm text-slate-500">{c.court} · {c.caseNo}</div>
                  <div className="text-sm mt-1 text-slate-700">요점: {c.key}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 버튼 */}
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={() => window.print()}>
            PDF 저장 / 인쇄
          </Button>
          <Button variant="outline" asChild>
            <a href="/analyze">분석 다시 보기</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------- 상단 네비게이션 ------------------- */
function SiteNav({ user }: { user: any }) {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-2xl bg-slate-900" />
          <span className="font-bold tracking-tight">DivorceInsight</span>
        </div>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <a className="hover:text-slate-900 text-slate-600" href="/">홈</a>
          <a className="hover:text-slate-900 text-slate-600" href="/intake">입력</a>
          <a className="hover:text-slate-900 text-slate-600" href="/analyze">분석</a>
          <a className="hover:text-slate-900 text-slate-600" href="/report">리포트</a>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-slate-600 hidden md:inline">{user.email}</span>
              <Button variant="outline" onClick={handleLogout}>로그아웃</Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline"><a href="/login">로그인</a></Button>
              <Button asChild><a href="/register">회원가입</a></Button>
            </>
          )}
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
