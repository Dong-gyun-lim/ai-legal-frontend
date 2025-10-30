'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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

/* ======================= 타입/상수 ======================= */

// ✅ NEW: 확장 타입들
type IncomeBand = 'under200' | '200_400' | '400_600' | '600_800' | '800plus' | '';
type ChildAgeBand = 'infant' | 'elem' | 'mid_high' | 'adult' | '';
type FaultRatio = 'spouse' | 'self' | 'both' | 'unknown' | '';
type CaseType = 'divorce' | 'separation' | 'damages' | 'custody' | 'property';

// 기존 사유(간단)
const REASONS = [
    { id: 'adultery', label: '외도' },
    { id: 'violence', label: '폭행' },
    { id: 'economic', label: '경제적 문제' },
    { id: 'incompatibility', label: '성격 차이' },
    { id: 'etc', label: '기타' },
];

// ✅ NEW: 추가 상수들
const CASE_TYPES: { id: CaseType; label: string }[] = [
    { id: 'divorce', label: '이혼' },
    { id: 'separation', label: '별거' },
    { id: 'damages', label: '위자료' },
    { id: 'custody', label: '양육' },
    { id: 'property', label: '재산분할' },
];

const CHILD_AGE_OPTIONS = [
    { id: 'infant', label: '유아' },
    { id: 'elem', label: '초등' },
    { id: 'mid_high', label: '중·고' },
    { id: 'adult', label: '성년' },
];

const EVIDENCE_OPTIONS = [
    { id: 'msg', label: '메시지' },
    { id: 'photo', label: '사진' },
    { id: 'medical', label: '진단서' },
    { id: 'record', label: '통화녹취' },
    { id: 'bank', label: '계좌내역' },
    { id: 'etc', label: '기타' },
];

const ASSET_TYPES = [
    { id: 'house', label: '주택' },
    { id: 'deposit', label: '예금' },
    { id: 'retire', label: '퇴직금' },
    { id: 'car', label: '자동차' },
    { id: 'stock', label: '주식' },
    { id: 'etc', label: '기타' },
];
// ✅ 예시/템플릿/도움말
const SUMMARY_TEMPLATE = `[핵심 요약] 외도 + 10년 혼인, 자녀 2명(초등), 별거 6개월.
[사실 관계] 외도 정황 메시지/사진 확보, 2024.11. 탐지. 폭력·상해 없음.
[경제 상황] 배우자 월 450만, 본인 320만. 주택 전세, 대출 5천.
[청구 취지] 위자료 2천 내외, 자녀 양육권 본인, 재산분할 공평.
[특이 사항] 상담/조정 1회 불성립, 상대방 반성 없음·양육참여 낮음.`;

const SUMMARY_EXAMPLES: string[] = [
    `[핵심 요약] 외도 + 8년 혼인, 자녀 1명(유아), 별거 3개월.
[사실 관계] 제3자와 메시지·사진 확보, 상간자 신원 특정 가능.
[경제 상황] 본인 300만, 배우자 420만. 전세, 대출 3천.
[청구 취지] 위자료 1500~2000, 양육권 본인, 면접교섭 제한 일부.
[특이 사항] 조정 1회 불성립, 배우자 반성 없음.`,
    `[핵심 요약] 폭력 + 6년 혼인, 자녀 0명, 별거 1개월.
[사실 관계] 상해 진단서·통화 녹취 확보, 경찰 신고 2회.
[경제 상황] 본인 350만, 배우자 350만. 월세, 부채 없음.
[청구 취지] 위자료 2000 내외, 접근금지 신청 검토.
[특이 사항] 가해자 치료 의지 없음, 재발 우려 높음.`,
    `[핵심 요약] 경제적 학대/도박 + 12년 혼인, 자녀 2명(중·고).
[사실 관계] 계좌내역으로 도박 정황, 생활비 미지급 지속.
[경제 상황] 본인 280만, 배우자 450만. 자가, 대출 1억.
[청구 취지] 위자료 1500, 재산분할 공동기여 주장, 양육권 본인.
[특이 사항] 조정 시도 2회, 불성립. 상대방 양육참여 미미.`,
];

const SUMMARY_MIN = 600; // 권장 하한(검증은 경고만)
const SUMMARY_MAX = 800; // 절대 상한(입력 차단)

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
    claimProperty: boolean; //재산분할 청구 토글
    incidentYear: string; // 연도
    wantWinProbability: boolean; // 승소 여부 예측 포함 여부
    otherEvidence?: string;

    // ✅ NEW: 확장 필드들
    caseTypes: CaseType[]; // 사건유형(복수)
    childAgeBand: ChildAgeBand; // 자녀 연령대
    faultRatio: FaultRatio; // 귀책 비율
    separated: boolean; // 별거 여부
    separationMonths: string; // 별거 기간(개월, 숫자 문자열)
    incomeSelf: IncomeBand; // 본인 월소득
    incomeSpouse: IncomeBand; // 배우자 월소득
    hasDebtSelf: boolean; // 본인 부채 유무
    hasDebtSpouse: boolean; // 배우자 부채 유무
    evidences: string[]; // 증거 보유(복수)
    triedMediation: boolean; // 협의/조정 시도 여부
    litigationStage: 'consult' | 'prep' | 'trial1' | 'appeal' | 'final' | '';

    // ✅ NEW: 조건부 - 위자료
    damagesDesiredMin?: string; // 만원 단위
    damagesDesiredMax?: string;
    damagesEvidenceViolence?: boolean;
    damagesEvidenceAdultery?: boolean;
    damagesTreatmentRecord?: boolean;

    // ✅ NEW: 조건부 - 양육
    caregivingHistory?: string; // 주양육자 이력
    caregivingEnv?: string; // 거주/돌봄 환경
    otherParentIssues?: string; // 상대방 양육능력 이슈

    // ✅ NEW: 조건부 - 재산분할
    contribution?: 'self' | 'spouse' | 'joint' | '';
    assetTypes?: string[];
};

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
        claimProperty: false,
        incidentYear: '',
        wantWinProbability: true,
        otherEvidence: '',

        // ✅ NEW 초기값
        caseTypes: [],
        childAgeBand: '',
        faultRatio: '',
        separated: false,
        separationMonths: '',
        incomeSelf: '',
        incomeSpouse: '',
        hasDebtSelf: false,
        hasDebtSpouse: false,
        evidences: [],
        triedMediation: false,
        litigationStage: '',
        damagesDesiredMin: '',
        damagesDesiredMax: '',
        damagesEvidenceViolence: false,
        damagesEvidenceAdultery: false,
        damagesTreatmentRecord: false,
        caregivingHistory: '',
        caregivingEnv: '',
        otherParentIssues: '',
        contribution: '',
        assetTypes: [],
    });
    // ✅ form 상태가 바뀔 때마다 자동 저장(페이지 이탈 복원)
    useEffect(() => {
        try {
            sessionStorage.setItem('intakeForm', JSON.stringify(form));
        } catch {}
    }, [form]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // 숫자 입력 가드 (혼인기간/자녀수/별거개월/위자료희망범위)
    const handleNumericChange =
        (name: 'marriageYears' | 'childCount' | 'separationMonths' | 'damagesDesiredMin' | 'damagesDesiredMax') =>
        (e: ChangeEvent<HTMLInputElement>) => {
            const digits = onlyDigits(e.target.value);
            setForm((prev) => ({ ...prev, [name]: digits }));
        };

    // 증감 버튼 (혼인기간/자녀수)
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
            const clearedOther = id === 'etc' && !on ? '' : prev.otherReason;
            return { ...prev, reasons: next, otherReason: clearedOther };
        });
    };

    const validate = () => {
        if (!form.title.trim()) return '사건 제목을 입력해주세요.';
        if (!form.gender) return '성별을 선택해주세요.';
        if (!form.incidentYear) return '사건 발생 연도를 선택해주세요.';
        if (!form.summary.trim()) return '사건 개요(요약 5줄)를 입력해주세요.';

        // 혼인기간 0–60
        if (form.marriageYears) {
            const y = toNonNegativeInt(form.marriageYears);
            if (y.toString() !== form.marriageYears || y > 60) return '혼인기간은 0~60년의 정수로 입력해주세요.';
        }

        // 자녀 수 0–10
        if (form.childCount) {
            const c = toNonNegativeInt(form.childCount);
            if (c.toString() !== form.childCount || c > 10) return '자녀 수는 0~10명 범위의 정수로 입력해주세요.';
        }

        // 별거
        if (form.separated && !form.separationMonths) return '별거 기간(개월)을 입력해주세요.';

        // 사유 최소 1개
        if (!form.reasons.length) return '주된 파탄 사유를 1개 이상 선택해주세요.';

        // 위자료: 숫자 범위(만원) 0~20000 허용, 둘 다 비었으면 허용(선택)
        const min = form.damagesDesiredMin ? toNonNegativeInt(form.damagesDesiredMin) : undefined;
        const max = form.damagesDesiredMax ? toNonNegativeInt(form.damagesDesiredMax) : undefined;
        if (form.claimDamages) {
            if (min !== undefined && min > 20000) return '희망 위자료 최소는 0~20000만원 이내로 입력해주세요.';
            if (max !== undefined && max > 20000) return '희망 위자료 최대는 0~20000만원 이내로 입력해주세요.';
            if (min !== undefined && max !== undefined && min > max) return '희망 위자료 최소가 최대보다 큽니다.';
        }

        // 요약 권장 하한 미달은 경고만 (막지 않음)
        return null;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const err = validate();
        if (err) {
            toast.error('입력 필요', { description: err });
            return;
        }

        // 숫자 정규화
        const marriageYearsNum = form.marriageYears ? toNonNegativeInt(form.marriageYears) : 0;
        const childCountNum = form.childCount ? toNonNegativeInt(form.childCount) : 0;

        const normalized: any = {
            ...form,
            marriageYears: marriageYearsNum,
            childCount: childCountNum,
            wantWinProbability: form.wantWinProbability,
            separationMonths: form.separationMonths ? toNonNegativeInt(form.separationMonths) : 0,
            damagesDesiredMin: form.damagesDesiredMin ? toNonNegativeInt(form.damagesDesiredMin) : undefined,
            damagesDesiredMax: form.damagesDesiredMax ? toNonNegativeInt(form.damagesDesiredMax) : undefined,
        };

        // 자녀 0이면 양육 관련 필드 제거
        if (childCountNum === 0) {
            delete normalized.claimCustody;
            delete normalized.caregivingHistory;
            delete normalized.caregivingEnv;
            delete normalized.otherParentIssues;
            delete normalized.childAgeBand; // 자녀 연령대도 무의미
        }

        // ✅ 재산분할 스위치가 꺼져 있으면 관련 필드 제거
        if (!normalized.claimProperty) {
            delete normalized.assetTypes;
            delete normalized.contribution;
        }

        // ===== 백엔드/프롬프트용 payload 생성 =====
        const childAges = form.childAgeBand
            ? [
                  form.childAgeBand === 'infant'
                      ? '유아'
                      : form.childAgeBand === 'elem'
                      ? '초등'
                      : form.childAgeBand === 'mid_high'
                      ? '중·고'
                      : '성년',
              ]
            : [];

        const caseTypeKor = form.caseTypes.map((c) =>
            c === 'divorce'
                ? '이혼'
                : c === 'separation'
                ? '별거'
                : c === 'damages'
                ? '위자료'
                : c === 'custody'
                ? '양육'
                : '재산분할'
        );

        const faultKor =
            form.faultRatio === 'spouse'
                ? '배우자'
                : form.faultRatio === 'self'
                ? '본인'
                : form.faultRatio === 'both'
                ? '상호'
                : '불명';

        // 희망 위자료 "1500~2000" 형태 합성
        const alimonyWant =
            form.damagesDesiredMin && form.damagesDesiredMax
                ? `${toNonNegativeInt(form.damagesDesiredMin)}~${toNonNegativeInt(form.damagesDesiredMax)}`
                : form.damagesDesiredMin
                ? `${toNonNegativeInt(form.damagesDesiredMin)}~`
                : form.damagesDesiredMax
                ? `~${toNonNegativeInt(form.damagesDesiredMax)}`
                : undefined;

        const payloadForBackend = {
            caseType: caseTypeKor,
            marriageYears: toNonNegativeInt(form.marriageYears || '0'),
            childCount: toNonNegativeInt(form.childCount || '0'),
            childAges,
            mainCauses: form.reasons.map((r) =>
                r === 'adultery'
                    ? '외도'
                    : r === 'violence'
                    ? '폭력'
                    : r === 'economic'
                    ? '경제적 문제'
                    : r === 'incompatibility'
                    ? '성격 차이'
                    : r === 'etc'
                    ? '기타'
                    : r
            ),
            separation: {
                has: !!form.separated,
                months: form.separated ? toNonNegativeInt(form.separationMonths || '0') : 0,
            },
            fault: faultKor,
            income: {
                self: form.incomeSelf
                    ? form.incomeSelf.replace('_', '~').replace('under200', '~200').replace('800plus', '800+')
                    : '',
                spouse: form.incomeSpouse
                    ? form.incomeSpouse.replace('_', '~').replace('under200', '~200').replace('800plus', '800+')
                    : '',
            },
            debt: form.hasDebtSelf || form.hasDebtSpouse ? '있음' : '없음',
            evidence: form.evidences.map((e) =>
                e === 'msg'
                    ? '메시지'
                    : e === 'photo'
                    ? '사진'
                    : e === 'medical'
                    ? '진단서'
                    : e === 'record'
                    ? '통화녹취'
                    : e === 'bank'
                    ? '계좌내역'
                    : '기타'
            ),
            attempts: { mediation: !!form.triedMediation },
            claims: {
                alimony: form.claimDamages
                    ? {
                          want: alimonyWant,
                          violence: !!form.damagesEvidenceViolence,
                          adultery: !!form.damagesEvidenceAdultery,
                      }
                    : undefined,
                custody:
                    toNonNegativeInt(form.childCount || '0') > 0 && form.claimCustody
                        ? {
                              primaryCareYears: undefined, // 필요 시 form.caregivingHistory 파싱해 수치화 가능
                              environment: form.caregivingEnv || undefined,
                          }
                        : undefined,
                // ✅ 스위치 기준으로만 포함
                property: form.claimProperty
                    ? {
                          assets: (form.assetTypes || []).map((a) =>
                              a === 'house'
                                  ? '주택'
                                  : a === 'deposit'
                                  ? '예금'
                                  : a === 'retire'
                                  ? '퇴직금'
                                  : a === 'car'
                                  ? '자동차'
                                  : a === 'stock'
                                  ? '주식'
                                  : '기타'
                          ),
                          contribution:
                              form.contribution === 'self'
                                  ? '본인'
                                  : form.contribution === 'spouse'
                                  ? '배우자'
                                  : form.contribution === 'joint'
                                  ? '공동'
                                  : undefined,
                      }
                    : undefined,
            },
            summary5: form.summary.split('\n').slice(0, 5),
        };

        // 디버그/AI 프롬프트용으로 별도 저장
        sessionStorage.setItem('intakePayload', JSON.stringify(payloadForBackend));

        // 원본 intakeForm 저장
        sessionStorage.setItem('intakeForm', JSON.stringify(normalized));

        toast.success('입력 완료', { description: '분석 페이지로 이동합니다.' });
        router.push('/analyze');
    };

    // 연도 옵션 (최근 15년)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 15 }, (_, i) => String(currentYear - i));

    const etcChecked = form.reasons.includes('etc');

    // 자녀가 있을 때만 양육권 노출
    const childCountNum = form.childCount ? toNonNegativeInt(form.childCount) : 0;
    const showCustody = childCountNum > 0;

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-2xl shadow-md">
                <CardHeader>
                    <CardTitle>사건 정보 입력</CardTitle>
                    <CardDescription>아래 사건 정보를 입력하세요.</CardDescription>
                </CardHeader>
                {/* ✅ 진행률 표시 헤더 */}
                <div className="mb-6 px-1">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-slate-700">기본 정보 + 청구별 세부</span>
                        <span className="text-sm font-semibold text-slate-600">2 / 2</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div
                            className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 transition-all duration-500"
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>

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

                            {/* ✅ NEW: 사건 유형(복수) */}
                            <div className="space-y-2">
                                <Label>사건 유형 (복수 선택 가능)</Label>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                    {CASE_TYPES.map((ct) => (
                                        <label key={ct.id} className="flex items-center gap-2 rounded-md border p-2">
                                            <Checkbox
                                                checked={form.caseTypes.includes(ct.id)}
                                                onCheckedChange={(c) => {
                                                    const on = c === true;
                                                    setForm((p) => ({
                                                        ...p,
                                                        caseTypes: on
                                                            ? Array.from(new Set([...p.caseTypes, ct.id]))
                                                            : p.caseTypes.filter((x) => x !== ct.id),
                                                    }));
                                                }}
                                            />
                                            <span className="text-sm">{ct.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* ✅ NEW: 자녀 연령대 & 귀책 비율 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>자녀 주요 연령대</Label>
                                    <Select
                                        value={form.childAgeBand}
                                        onValueChange={(v) => setForm((p) => ({ ...p, childAgeBand: v as any }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="선택" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CHILD_AGE_OPTIONS.map((o) => (
                                                <SelectItem key={o.id} value={o.id}>
                                                    {o.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>귀책 비율 (주관 추정)</Label>
                                    <Select
                                        value={form.faultRatio}
                                        onValueChange={(v) => setForm((p) => ({ ...p, faultRatio: v as any }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="선택" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="spouse">배우자</SelectItem>
                                            <SelectItem value="self">본인</SelectItem>
                                            <SelectItem value="both">상호</SelectItem>
                                            <SelectItem value="unknown">불명</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* 주요 이혼 사유 (복수 선택 가능) */}
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
                                {form.reasons.includes('etc') && (
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

                            {/* ✅ NEW: 별거/소득·재산/증거/협의·소송 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center justify-between rounded-md border p-3">
                                    <div>
                                        <Label className="block">별거 여부</Label>
                                        <p className="text-xs text-slate-500">현재 별거 중인가요?</p>
                                    </div>
                                    <Switch
                                        checked={form.separated}
                                        onCheckedChange={(v) => setForm((p) => ({ ...p, separated: !!v }))}
                                    />
                                </div>

                                {form.separated && (
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="separationMonths">별거 기간 (개월)</Label>
                                        <Input
                                            id="separationMonths"
                                            inputMode="numeric"
                                            placeholder="예: 6"
                                            value={form.separationMonths}
                                            onChange={handleNumericChange('separationMonths')}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>본인 월소득</Label>
                                    <Select
                                        value={form.incomeSelf}
                                        onValueChange={(v) => setForm((p) => ({ ...p, incomeSelf: v as any }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="선택" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="under200">~200</SelectItem>
                                            <SelectItem value="200_400">200~400</SelectItem>
                                            <SelectItem value="400_600">400~600</SelectItem>
                                            <SelectItem value="600_800">600~800</SelectItem>
                                            <SelectItem value="800plus">800+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="flex items-center justify-between rounded-md border p-3">
                                        <span className="text-sm">본인 부채 유무</span>
                                        <Switch
                                            checked={form.hasDebtSelf}
                                            onCheckedChange={(v) => setForm((p) => ({ ...p, hasDebtSelf: !!v }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>배우자 월소득</Label>
                                    <Select
                                        value={form.incomeSpouse}
                                        onValueChange={(v) => setForm((p) => ({ ...p, incomeSpouse: v as any }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="선택" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="under200">~200</SelectItem>
                                            <SelectItem value="200_400">200~400</SelectItem>
                                            <SelectItem value="400_600">400~600</SelectItem>
                                            <SelectItem value="600_800">600~800</SelectItem>
                                            <SelectItem value="800plus">800+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="flex items-center justify-between rounded-md border p-3">
                                        <span className="text-sm">배우자 부채 유무</span>
                                        <Switch
                                            checked={form.hasDebtSpouse}
                                            onCheckedChange={(v) => setForm((p) => ({ ...p, hasDebtSpouse: !!v }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>증거 보유</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {EVIDENCE_OPTIONS.map((ev) => (
                                        <label key={ev.id} className="flex items-center gap-2 rounded-md border p-2">
                                            <Checkbox
                                                checked={form.evidences.includes(ev.id)}
                                                onCheckedChange={(c) => {
                                                    const on = c === true;
                                                    setForm((p) => ({
                                                        ...p,
                                                        evidences: on
                                                            ? Array.from(new Set([...p.evidences, ev.id]))
                                                            : p.evidences.filter((x) => x !== ev.id),
                                                    }));
                                                }}
                                            />
                                            <span className="text-sm">{ev.label}</span>
                                        </label>
                                    ))}
                                </div>
                                {/* ✅ “기타” 선택 시 상세 입력칸 표시 */}
                                {form.evidences.includes('etc') && (
                                    <div className="mt-2">
                                        <Label htmlFor="otherEvidence" className="text-xs text-slate-600">
                                            기타 증거 상세
                                        </Label>
                                        <Input
                                            id="otherEvidence"
                                            name="otherEvidence"
                                            placeholder="예: 문자 대화 캡처, 녹취 일부 등"
                                            value={(form as any).otherEvidence || ''}
                                            onChange={(e) =>
                                                setForm((p) => ({
                                                    ...p,
                                                    otherEvidence: e.target.value,
                                                }))
                                            }
                                            className="mt-1"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between rounded-md border p-3">
                                    <div>
                                        <Label className="block">협의/조정 시도</Label>
                                        <p className="text-xs text-slate-500">상대방과 협의 또는 조정을 시도했나요?</p>
                                    </div>
                                    <Switch
                                        checked={form.triedMediation}
                                        onCheckedChange={(v) => setForm((p) => ({ ...p, triedMediation: !!v }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>소송 단계</Label>
                                    <Select
                                        value={form.litigationStage}
                                        onValueChange={(v) => setForm((p) => ({ ...p, litigationStage: v as any }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="선택" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="consult">상담</SelectItem>
                                            <SelectItem value="prep">준비</SelectItem>
                                            <SelectItem value="trial1">1심</SelectItem>
                                            <SelectItem value="appeal">항소</SelectItem>
                                            <SelectItem value="final">확정</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* 위자료/승소/양육권 토글들 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* 위자료 */}
                                <div className="flex items-center justify-between rounded-md border p-3">
                                    <div>
                                        <Label className="block">위자료 청구 여부</Label>
                                        <p className="text-xs text-slate-500">위자료를 청구할 계획인가요?</p>
                                    </div>
                                    <Switch
                                        checked={form.claimDamages}
                                        onCheckedChange={(v: boolean) => setForm((p) => ({ ...p, claimDamages: v }))}
                                    />
                                </div>

                                {/* 승소 여부 예측 포함 */}
                                <div className="flex items-center justify-between rounded-md border p-3">
                                    <div>
                                        <Label className="block">승소 여부 알고 싶나요?</Label>
                                        <p className="text-xs text-slate-500">예측 결과에 승소 가능성을 포함합니다.</p>
                                    </div>
                                    <Switch
                                        checked={form.wantWinProbability}
                                        onCheckedChange={(v: boolean) =>
                                            setForm((p) => ({ ...p, wantWinProbability: v }))
                                        }
                                    />
                                </div>

                                {/* 양육권 (자녀 있을 때만 표시) */}
                                {showCustody && (
                                    <div className="flex items-center justify-between rounded-md border p-3 md:col-span-2">
                                        <div>
                                            <Label className="block">양육권 청구 여부</Label>
                                            <p className="text-xs text-slate-500">양육권을 청구할 계획인가요?</p>
                                        </div>
                                        <Switch
                                            checked={form.claimCustody}
                                            onCheckedChange={(v: boolean) =>
                                                setForm((p) => ({ ...p, claimCustody: v }))
                                            }
                                        />
                                    </div>
                                )}
                            </div>

                            {/* ✅ NEW: 조건부 섹션들 */}
                            {/* 위자료 조건부 */}
                            {form.claimDamages && (
                                <div className="rounded-lg border p-4 space-y-3">
                                    <Label className="font-semibold">위자료 추가 정보</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <Input
                                            placeholder="희망 범위 최소 (만원)"
                                            value={form.damagesDesiredMin ?? ''}
                                            onChange={handleNumericChange('damagesDesiredMin')}
                                        />
                                        <Input
                                            placeholder="희망 범위 최대 (만원)"
                                            value={form.damagesDesiredMax ?? ''}
                                            onChange={handleNumericChange('damagesDesiredMax')}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        <label className="flex items-center gap-2">
                                            <Checkbox
                                                checked={!!form.damagesEvidenceViolence}
                                                onCheckedChange={(c) =>
                                                    setForm((p) => ({
                                                        ...p,
                                                        damagesEvidenceViolence: c === true,
                                                    }))
                                                }
                                            />
                                            폭력 증거
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <Checkbox
                                                checked={!!form.damagesEvidenceAdultery}
                                                onCheckedChange={(c) =>
                                                    setForm((p) => ({
                                                        ...p,
                                                        damagesEvidenceAdultery: c === true,
                                                    }))
                                                }
                                            />
                                            외도 증거
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <Checkbox
                                                checked={!!form.damagesTreatmentRecord}
                                                onCheckedChange={(c) =>
                                                    setForm((p) => ({
                                                        ...p,
                                                        damagesTreatmentRecord: c === true,
                                                    }))
                                                }
                                            />
                                            치료 기록(진단서 등)
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* 양육 조건부 */}
                            {showCustody && form.claimCustody && (
                                <div className="rounded-lg border p-4 space-y-3">
                                    <Label className="font-semibold">양육 추가 정보</Label>
                                    <Input
                                        placeholder="주양육자 이력 (예: 본인 3년, 조부모 보조)"
                                        value={form.caregivingHistory ?? ''}
                                        name="caregivingHistory"
                                        onChange={handleChange}
                                    />
                                    <Input
                                        placeholder="양육환경 (거주/돌봄 지원 등)"
                                        value={form.caregivingEnv ?? ''}
                                        name="caregivingEnv"
                                        onChange={handleChange}
                                    />
                                    <Input
                                        placeholder="상대방 양육능력 이슈"
                                        value={form.otherParentIssues ?? ''}
                                        name="otherParentIssues"
                                        onChange={handleChange}
                                    />
                                </div>
                            )}

                            {/* 재산분할 토글성: 아무 항목도 없으면 꺼진 상태로 간주 */}
                            <div className="flex items-center justify-between rounded-md border p-3">
                                <div>
                                    <Label className="block">재산분할 청구</Label>
                                    <p className="text-xs text-slate-500">재산분할을 청구할 계획인가요?</p>
                                </div>
                                <Switch
                                    checked={form.claimProperty}
                                    onCheckedChange={(v) => setForm((p) => ({ ...p, claimProperty: v === true }))}
                                />
                            </div>

                            {/* 재산분할 조건부 */}
                            {form.claimProperty && (
                                <div className="rounded-lg border p-4 space-y-3">
                                    <Label className="font-semibold">재산분할 추가 정보</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        {ASSET_TYPES.map((a) => (
                                            <label key={a.id} className="flex items-center gap-2 rounded-md border p-2">
                                                <Checkbox
                                                    checked={form.assetTypes?.includes(a.id) ?? false}
                                                    onCheckedChange={(c) => {
                                                        const on = c === true;
                                                        setForm((p) => ({
                                                            ...p,
                                                            assetTypes: on
                                                                ? Array.from(new Set([...(p.assetTypes || []), a.id]))
                                                                : (p.assetTypes || []).filter((x) => x !== a.id),
                                                        }));
                                                    }}
                                                />
                                                <span className="text-sm">{a.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>재산 형성 기여도</Label>
                                        <Select
                                            value={form.contribution || ''}
                                            onValueChange={(v) => setForm((p) => ({ ...p, contribution: v as any }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="선택" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="self">본인</SelectItem>
                                                <SelectItem value="spouse">배우자</SelectItem>
                                                <SelectItem value="joint">공동</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </section>

                        <Separator />

                        {/* 2) 기존 자유 입력 섹션 */}
                        {/* 2) 자유 입력 (5줄 템플릿 + 카운터 + 예시 버튼) */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-semibold text-slate-900">사건 개요 (자유 입력)</h3>
                                <div className="text-xs text-slate-500">
                                    권장 {SUMMARY_MIN}~{SUMMARY_MAX}자 · 줄별 1~2문장
                                </div>
                            </div>

                            {/* 제목은 유지 */}
                            <Input
                                name="title"
                                placeholder="사건 제목 (예: 외도와 별거에 따른 이혼 및 양육권 청구)"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />

                            {/* 5줄 템플릿 도움말/예시 버튼 */}
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                <span className="text-slate-600">템플릿</span>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setForm((p) => ({ ...p, summary: SUMMARY_TEMPLATE }))}
                                >
                                    템플릿 채우기
                                </Button>
                                <span className="ml-2 text-slate-400">|</span>
                                <span className="ml-2 text-slate-600">예시 보기</span>
                                {SUMMARY_EXAMPLES.map((ex, i) => (
                                    <Button
                                        key={i}
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setForm((p) => ({ ...p, summary: ex }))}
                                    >
                                        예시{i + 1}
                                    </Button>
                                ))}
                            </div>

                            {/* 본문 + 글자수 카운터 */}
                            <div>
                                <Textarea
                                    name="summary"
                                    placeholder={SUMMARY_TEMPLATE}
                                    rows={8}
                                    value={form.summary.slice(0, SUMMARY_MAX)} // 상한 캡
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setForm((p) => ({
                                            ...p,
                                            summary: v.length > SUMMARY_MAX ? v.slice(0, SUMMARY_MAX) : v,
                                        }));
                                    }}
                                />
                                <div className="mt-1 flex items-center justify-between text-xs">
                                    <span
                                        className={
                                            form.summary.length < SUMMARY_MIN ? 'text-amber-600' : 'text-slate-500'
                                        }
                                    >
                                        {form.summary.length < SUMMARY_MIN
                                            ? '조금 더 자세히 적어주세요 (권장 하한 미달)'
                                            : '좋아요!'}
                                    </span>
                                    <span
                                        className={
                                            form.summary.length > SUMMARY_MAX ? 'text-red-600' : 'text-slate-500'
                                        }
                                    >
                                        {form.summary.length}/{SUMMARY_MAX}자
                                    </span>
                                </div>
                            </div>

                            {/* 마이크로카피 */}
                            <ul className="text-xs text-slate-500 space-y-1">
                                <li>
                                    <b>혼인기간</b>: 대략도 OK (예: 9~10년)
                                </li>
                                <li>
                                    <b>증거</b>: ‘있음’ 체크만 해도 됩니다. 자세한 내용은 개요에 한 줄
                                </li>
                                <li>
                                    <b>희망 위자료</b>: 범위로 적기 (예: 1500~2000)
                                </li>
                                <li>
                                    <b>주양육자</b>: 최근 2년 기준 실제 돌봄이 더 많은 사람
                                </li>
                            </ul>
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
