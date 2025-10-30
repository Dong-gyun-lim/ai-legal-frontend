'use client';

import { Button } from '@/components/ui/button';

type Props = {
    onConfirm: () => void; // 계속 진행(게스트 확정)
    onCancel: () => void; // 취소(뒤로)
};

export default function ConfirmGuestModal({ onConfirm, onCancel }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-[380px] rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
                <h2 className="mb-3 text-center text-lg font-semibold text-red-600">⚠️ 비회원 이용 안내</h2>
                <p className="mb-5 text-center text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    비회원으로 이용 시 <b>입력/분석 결과가 저장되지 않습니다.</b>
                    <br />
                    새로고침·창 닫기 시 모든 내용이 사라집니다.
                    <br />
                    계속 진행할까요?
                </p>
                <div className="flex justify-center gap-3">
                    <Button variant="destructive" onClick={onConfirm}>
                        계속 진행
                    </Button>
                    <Button variant="outline" onClick={onCancel}>
                        취소
                    </Button>
                </div>
            </div>
        </div>
    );
}
