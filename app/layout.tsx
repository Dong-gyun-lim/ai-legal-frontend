import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import SiteNav from '@/components/SiteNav';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider'; // ✅ 추가

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
        <html lang="ko" suppressHydrationWarning>
            {/* ✅ ThemeProvider로 감싸기 */}
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors`}
            >
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="di-theme">
                    <SiteNav />
                    <main>{children}</main>
                    <Toaster richColors position="top-center" />
                </ThemeProvider>
            </body>
        </html>
    );
}
