import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import SiteNav from '@/components/SiteNav'; // ✅ 네비게이션 import
import { Toaster } from 'sonner'; // ✅ 추가

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'DivorceInsight',
    description: 'AI 기반 이혼·양육 분쟁 분석 플랫폼',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}>
                {/* ✅ 전역 네비게이션 (모든 페이지 상단 고정) */}
                <SiteNav />
                {/* ✅ 페이지별 내용 */}
                <main>{children}</main>
                <Toaster richColors position="top-center" /> {/* ✅ 전역 토스트 */}
            </body>
        </html>
    );
}
