'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FindPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`비밀번호 재설정 링크가 이메일(${email})로 전송되었습니다.`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
        <h2 className="text-2xl font-bold text-center mb-2">비밀번호 찾기</h2>
        <p className="text-center text-slate-500 mb-6">등록된 이메일 주소를 입력하세요.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">비밀번호 재설정</Button>
        </form>
      </div>
    </div>
  );
}
