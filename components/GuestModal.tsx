'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GuestModal({
    onContinueAsGuest,
    onGoLogin,
}: {
    onContinueAsGuest: () => void;
    onGoLogin?: () => void;
}) {
    const router = useRouter();

    // 배경 스크롤 차단
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-[90%] max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl">
                <h2 className="mb-2 text-xl font-bold text-center">이용 방법을 선택해주세요</h2>
                <p className="mb-6 text-sm text-slate-600 dark:text-slate-400 text-center">
                    로그인 없이 비회원으로 이용할 수 있습니다.
                    <br />
                    (내역 저장 등 일부 기능은 로그인 시 제공)
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onContinueAsGuest}
                        className="w-full h-10 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
                    >
                        비회원으로 계속하기
                    </button>

                    <button
                        onClick={onGoLogin ?? (() => router.push('/login'))}
                        className="w-full h-10 rounded-lg border border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition"
                    >
                        로그인하기
                    </button>
                </div>
            </div>
        </div>
    );
}
