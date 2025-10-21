'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

type FormState = {
    // 자유 입력
    title: string;
    reason: string;
    summary: string;
    // 정형 입력
    gender: 'male' | 'female' | '';
    ageRange: '20s' | '30s' | '40s' | '50plus' | '';
    marriageYears: string; // 숫자 문자열
    childCount: string; // 숫자 문자열
    reasons: string[]; // 다중 선택
    otherReason: string; // "기타" 상세
    role: 'victim' | 'perpetrator' | 'both' | '';
    claimDamages: boolean;
    claimCustody: boolean;
    incidentYear: string; // 연도
};

const REASONS = [
    { id: 'adultery', label: '외도' },
    { id: 'violence', label: '폭행' },
    { id: 'economic', label: '경제적 문제' },
    { id: 'incompatibility', label: '성격 차이' },
    { id: 'etc', label: '기타' },
];

// 숫자 유틸
const onlyDigits = (v: string) => v.replace(/[^\d]/g, '');
const toNonNegativeInt = (v: string) => {
    const n = parseInt(onlyDigits(v || '0'), 10);
    return isNaN(n) || n < 0 ? 0 : n;
};

export default function IntakePage() {
    const router = useRouter();

    const [form, setForm] = useState<FormState>({
        title: '',
        reason: '',
        summary: '',
        gender: '',
        ageRange: '',
        marriageYears: '',
        childCount: '',
        reasons: [],
        otherReason: '',
        role: '',
        claimDamages: false,
        claimCustody: false,
        incidentYear: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // 숫자 입력 가드 (혼인기간/자녀수)
    const handleNumericChange = (name: 'marriageYears' | 'childCount') => (e: ChangeEvent<HTMLInputElement>) => {
        const digits = onlyDigits(e.target.value);
        setForm((prev) => ({ ...prev, [name]: digits }));
    };

    // 미니 증감 버튼
    const bump =
        (name: 'marriageYears' | 'childCount', delta: number, min = 0, max = 200) =>
        () => {
            const next = Math.min(max, Math.max(min, toNonNegativeInt(form[name]) + delta));
            setForm((prev) => ({ ...prev, [name]: String(next) }));
        };

    const toggleReason = (id: string, checked: boolean | string) => {
        setForm((prev) => {
            const on = checked === true || checked === 'on';
            const next = on ? Array.from(new Set([...prev.reasons, id])) : prev.reasons.filter((r) => r !== id);
            // "기타" 체크 해제 시 상세 입력 초기화
            const clearedOther = id === 'etc' && !on ? '' : prev.otherReason;
            return { ...prev, reasons: next, otherReason: clearedOther };
        });
    };

    const validate = () => {
        if (!form.title.trim()) return '사건 제목을 입력해주세요.';
        if (!form.gender) return '성별을 선택해주세요.';
        if (!form.incidentYear) return '사건 발생 연도를 선택해주세요.';

        // 혼인기간/자녀수: 정수 및 0 이상
        if (form.marriageYears && toNonNegativeInt(form.marriageYears).toString() !== form.marriageYears) {
            return '혼인기간은 0 이상의 정수만 입력해주세요.';
        }
        if (form.childCount && toNonNegativeInt(form.childCount).toString() !== form.childCount) {
            return '자녀 수는 0 이상의 정수만 입력해주세요.';
        }

        // "기타" 선택 시 상세 필수
        if (form.reasons.includes('etc') && !form.otherReason.trim()) {
            return '기타 사유를 입력해주세요.';
        }

        return null;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const err = validate();
        if (err) {
            toast.error('입력 필요', { description: err });
            return;
        }

        // 최종 전처리: 숫자 정규화
        const normalized = {
            ...form,
            marriageYears: form.marriageYears ? toNonNegativeInt(form.marriageYears) : 0,
            childCount: form.childCount ? toNonNegativeInt(form.childCount) : 0,
        };

        console.log('입력된 사건:', normalized);
        sessionStorage.setItem('intakeForm', JSON.stringify(normalized));

        toast.success('입력 완료', { description: '분석 페이지로 이동합니다.' });
        router.push('/analyze');
    };

    // 연도 옵션 (최근 15년)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 15 }, (_, i) => String(currentYear - i));

    const etcChecked = form.reasons.includes('etc');

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-2xl shadow-md">
                <CardHeader>
                    <CardTitle>사건 정보 입력</CardTitle>
                    <CardDescription>아래 사건 정보를 입력하세요.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* 1) 정형 입력 섹션 */}
                        <section className="space-y-4">
                            <h3 className="text-base font-semibold text-slate-900">기본 사건 정보 (정형 입력)</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* 성별 */}
                                <div className="space-y-2">
                                    <Label>성별</Label>
                                    <RadioGroup
                                        className="flex gap-6"
                                        value={form.gender}
                                        onValueChange={(v) =>
                                            setForm((prev) => ({ ...prev, gender: v as FormState['gender'] }))
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem id="gender-m" value="male" />
                                            <Label htmlFor="gender-m">남성</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem id="gender-f" value="female" />
                                            <Label htmlFor="gender-f">여성</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* 나이대 */}
                                <div className="space-y-2">
                                    <Label>나이대</Label>
                                    <Select
                                        value={form.ageRange}
                                        onValueChange={(v) =>
                                            setForm((prev) => ({ ...prev, ageRange: v as FormState['ageRange'] }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="선택하세요" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="20s">20대</SelectItem>
                                            <SelectItem value="30s">30대</SelectItem>
                                            <SelectItem value="40s">40대</SelectItem>
                                            <SelectItem value="50plus">50대 이상</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* 혼인기간(년) + 스텝퍼 */}
                                <div className="space-y-2">
                                    <Label htmlFor="marriageYears">혼인기간 (년)</Label>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={bump('marriageYears', -1)}
                                        >
                                            −
                                        </Button>
                                        <Input
                                            id="marriageYears"
                                            name="marriageYears"
                                            inputMode="numeric"
                                            placeholder="예: 10"
                                            value={form.marriageYears}
                                            onChange={handleNumericChange('marriageYears')}
                                            className="text-center"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={bump('marriageYears', +1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>

                                {/* 자녀 수 + 스텝퍼 */}
                                <div className="space-y-2">
                                    <Label htmlFor="childCount">자녀 수</Label>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={bump('childCount', -1)}
                                        >
                                            −
                                        </Button>
                                        <Input
                                            id="childCount"
                                            name="childCount"
                                            inputMode="numeric"
                                            placeholder="예: 2"
                                            value={form.childCount}
                                            onChange={handleNumericChange('childCount')}
                                            className="text-center"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={bump('childCount', +1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>

                                {/* 사건 발생 연도 */}
                                <div className="space-y-2">
                                    <Label>사건 발생 연도</Label>
                                    <Select
                                        value={form.incidentYear}
                                        onValueChange={(v) => setForm((prev) => ({ ...prev, incidentYear: v }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="연도 선택" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {years.map((y) => (
                                                <SelectItem key={y} value={y}>
                                                    {y}년
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* 가해/피해 구분 */}
                                <div className="space-y-2">
                                    <Label>가해자/피해자 구분</Label>
                                    <Select
                                        value={form.role}
                                        onValueChange={(v) =>
                                            setForm((prev) => ({ ...prev, role: v as FormState['role'] }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="선택하세요" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="victim">본인이 피해자</SelectItem>
                                            <SelectItem value="perpetrator">본인이 가해자</SelectItem>
                                            <SelectItem value="both">상호 책임</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* 주요 이혼 사유 (복수 선택) */}
                            <div className="space-y-2">
                                <Label>주요 이혼 사유 (복수 선택 가능)</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {REASONS.map((r) => (
                                        <label key={r.id} className="flex items-center gap-2 rounded-md border p-2">
                                            <Checkbox
                                                checked={form.reasons.includes(r.id)}
                                                onCheckedChange={(c) => toggleReason(r.id, c)}
                                            />
                                            <span className="text-sm">{r.label}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* "기타" 상세 입력 */}
                                {etcChecked && (
                                    <div className="mt-2">
                                        <Label htmlFor="otherReason" className="text-xs text-slate-600">
                                            기타 사유 상세
                                        </Label>
                                        <Input
                                            id="otherReason"
                                            name="otherReason"
                                            placeholder="예: 배우자의 지속적 가출 등"
                                            value={form.otherReason}
                                            onChange={handleChange}
                                            className="mt-1"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* 위자료/양육권 청구 여부 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between rounded-md border p-3">
                                    <div>
                                        <Label className="block">위자료 청구 여부</Label>
                                        <p className="text-xs text-slate-500">위자료를 청구할 계획인가요?</p>
                                    </div>
                                    <Switch
                                        checked={form.claimDamages}
                                        onCheckedChange={(v) => setForm((p) => ({ ...p, claimDamages: !!v }))}
                                    />
                                </div>

                                <div className="flex items-center justify-between rounded-md border p-3">
                                    <div>
                                        <Label className="block">양육권 청구 여부</Label>
                                        <p className="text-xs text-slate-500">양육권을 청구할 계획인가요?</p>
                                    </div>
                                    <Switch
                                        checked={form.claimCustody}
                                        onCheckedChange={(v) => setForm((p) => ({ ...p, claimCustody: !!v }))}
                                    />
                                </div>
                            </div>
                        </section>

                        <Separator />

                        {/* 2) 기존 자유 입력 섹션 */}
                        <section className="space-y-4">
                            <h3 className="text-base font-semibold text-slate-900">사건 개요 (자유 입력)</h3>
                            <Input
                                name="title"
                                placeholder="사건 제목"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="reason"
                                placeholder="주요 사유 (예: 외도, 폭행, 경제적 문제)"
                                value={form.reason}
                                onChange={handleChange}
                            />
                            <Textarea
                                name="summary"
                                placeholder="사건 요약을 입력하세요..."
                                rows={6}
                                value={form.summary}
                                onChange={handleChange}
                            />
                        </section>

                        <Button type="submit" className="w-full h-11 text-base">
                            AI 분석 시작하기
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
