'use client';
import { usePathname } from 'next/navigation';

export default function IntakeLayout({ children }: { children: React.ReactNode }) {
    const path = usePathname();
    const step = path.includes('/detail') ? 2 : 1;

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-2xl shadow-md bg-white rounded-lg">
                <div className="border-b px-6 py-4">
                    <h2 className="text-lg font-semibold">사건 정보 입력</h2>
                    <p className="text-sm text-slate-500 mb-2">아래 정보를 순서대로 입력하세요.</p>
                    <div className="flex justify-between text-sm text-slate-600 mb-1">
                        <span>{step === 1 ? '기본 정보' : '청구별 세부 + 개요'}</span>
                        <span className="font-medium">{step} / 2</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                                step === 1
                                    ? 'bg-gradient-to-r from-indigo-400 to-sky-400 w-1/2'
                                    : 'bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 w-full'
                            }`}
                        />
                    </div>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
