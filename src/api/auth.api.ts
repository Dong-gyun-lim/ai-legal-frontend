import type { User } from '@/Lib/auth';

// 실제로는 서버 요청으로 교체
export async function signIn(email: string, password: string): Promise<{ user: User; token: string }> {
    // TODO: 서버 연동으로 교체
    const user: User = {
        id: 'u_' + Math.random().toString(36).slice(2, 8),
        name: email.split('@')[0],
        email,
        // 깃허브 프로필 이미지 URL 예시: https://avatars.githubusercontent.com/u/<id>?v=4
        // 또는 저장된 조직 아바타 URL을 넣어도 됨
    };
    const token = 'fake-token-' + Date.now();
    await new Promise((r) => setTimeout(r, 300)); // UX용 지연
    return { user, token };
}

export async function signUp(name: string, email: string, password: string) {
    // TODO: 서버 연동으로 교체
    return signIn(email, password);
}
