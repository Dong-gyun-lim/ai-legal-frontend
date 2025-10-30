'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function BasicPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        gender: '',
        marriageYears: '',
        childCount: '',
    });

    const handleNext = () => {
        sessionStorage.setItem('intakeBasic', JSON.stringify(form));
        router.push('/intake/detail');
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">기본 사건 정보</h3>

            <div className="space-y-2">
                <Label>성별</Label>
                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant={form.gender === 'male' ? 'default' : 'outline'}
                        onClick={() => setForm((f) => ({ ...f, gender: 'male' }))}
                    >
                        남성
                    </Button>
                    <Button
                        type="button"
                        variant={form.gender === 'female' ? 'default' : 'outline'}
                        onClick={() => setForm((f) => ({ ...f, gender: 'female' }))}
                    >
                        여성
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <Label>혼인기간 (년)</Label>
                <Input
                    type="number"
                    placeholder="예: 10"
                    value={form.marriageYears}
                    onChange={(e) => setForm((f) => ({ ...f, marriageYears: e.target.value }))}
                />
            </div>

            <div className="space-y-2">
                <Label>자녀 수</Label>
                <Input
                    type="number"
                    placeholder="예: 2"
                    value={form.childCount}
                    onChange={(e) => setForm((f) => ({ ...f, childCount: e.target.value }))}
                />
            </div>

            <Button className="w-full h-11 text-base" onClick={handleNext}>
                다음 단계로 →
            </Button>
        </div>
    );
}
