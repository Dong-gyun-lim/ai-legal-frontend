'use client';

import { useState } from 'react';
import { Gavel, FileText, BarChart3, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

function ZoomableImage({ src, alt }: { src: string; alt: string }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            {/* 축소 이미지 */}
            <motion.img
                src={src}
                alt={alt}
                className="rounded-2xl border shadow-sm w-full max-w-sm cursor-zoom-in hover:opacity-90 transition"
                onClick={() => setOpen(true)}
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.02 }}
            />

            {/* 확대 모달 */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                    >
                        <motion.div
                            className="relative max-w-5xl max-h-[90vh] overflow-auto rounded-2xl"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()} // 내부 클릭은 닫히지 않게
                        >
                            <img
                                src={src}
                                alt={alt}
                                className="w-full h-auto rounded-2xl shadow-2xl object-contain cursor-zoom-out"
                                onClick={() => setOpen(false)}
                            />
                            <button
                                onClick={() => setOpen(false)}
                                className="absolute top-3 right-3 bg-black/50 rounded-full p-1.5 hover:bg-black/70"
                                aria-label="닫기"
                            >
                                <X className="h-5 w-5 text-white" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default function HelpMainFlowPage() {
    return (
        <div className="mx-auto max-w-5xl px-6 py-16 text-slate-800 dark:text-slate-200">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-3"
            >
                <h1 className="text-3xl md:text-4xl font-bold">이 서비스는 이렇게 동작합니다</h1>
                <p className="text-slate-600 dark:text-slate-400">
                    AI 기반 판례 분석으로, 당신의 상황과 유사한 사례를 찾아 위자료·양육권·재산분할 경향을 예측합니다.
                </p>
            </motion.header>

            <div className="mt-16 space-y-20">
                {/* 1️⃣ 단계 - 사건 정보 입력 */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row items-center gap-10"
                >
                    <div className="flex-1 space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <Gavel className="h-6 w-6 text-[#7B5E57]" /> 1단계 · 사건 정보 입력
                        </h2>
                        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                            먼저 간단한 정보를 입력합니다. 혼인 기간, 자녀 수, 이혼 사유 등 기본 정보를 선택하고
                            자유롭게 상황을 요약할 수 있습니다. 입력된 내용은 AI가 자동으로 정리하여 분석에 적합한
                            형태로 변환됩니다.
                        </p>
                    </div>
                    <ZoomableImage src="/images/help-intake.png" alt="사건 정보 입력 화면 예시" />
                </motion.section>

                {/* 2️⃣ 단계 - AI 분석 */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex flex-col md:flex-row-reverse items-center gap-10"
                >
                    <div className="flex-1 space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <BarChart3 className="h-6 w-6 text-[#7B5E57]" /> 2단계 · AI 유사도 분석
                        </h2>
                        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                            입력된 정보를 기반으로, AI가 수천 건의 판례 데이터를 검색합니다. 각 사건 간의 유사도를
                            계산하여, 가장 비슷한 사례들을 찾아내고 그 결과를 이해하기 쉬운 그래프와 수치로 보여줍니다.
                        </p>
                    </div>
                    <img
                        src="/images/help-analyze.png"
                        alt="AI 분석 화면 예시"
                        className="rounded-2xl border shadow-sm w-full max-w-md"
                    />
                </motion.section>

                {/* 3️⃣ 단계 - 리포트 */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex flex-col md:flex-row items-center gap-10"
                >
                    <div className="flex-1 space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <FileText className="h-6 w-6 text-[#7B5E57]" /> 3단계 · 결과 리포트 확인
                        </h2>
                        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                            AI 분석이 완료되면, 당신의 사건과 유사한 판례들의 결과가 요약된 리포트를 볼 수 있습니다.
                            주요 지표(유사도, 위자료 평균, 양육권 결정 비율 등)가 시각화되어 있으며, 원한다면 PDF로
                            저장하거나 공유할 수도 있습니다.
                        </p>
                    </div>
                    <img
                        src="/images/help-report.png"
                        alt="리포트 예시 화면"
                        className="rounded-2xl border shadow-sm w-full max-w-md"
                    />
                </motion.section>
            </div>

            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-24 text-center text-sm text-slate-500 border-t pt-8"
            >
                <HeartHandshake className="h-5 w-5 mx-auto mb-3 text-[#7B5E57]" />
                <p>본 서비스는 법률 자문을 대체하지 않으며, 공공 데이터를 기반으로 한 AI 분석 참고용 서비스입니다.</p>
            </motion.footer>
        </div>
    );
}
