import React, { createContext, useContext, useEffect, useState } from 'react';

export type User = {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string; // 깃허브 이미지 URL 넣으면 원형 이미지로 표시됨
};

type AuthContextType = {
    user: User | null;
    login: (u: User, token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const raw = localStorage.getItem('auth_v1');
        if (raw) {
            try {
                const { user } = JSON.parse(raw);
                setUser(user);
            } catch {}
        }
    }, []);

    const login = (u: User, token: string) => {
        setUser(u);
        localStorage.setItem('auth_v1', JSON.stringify({ token, user: u }));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('auth_v1');
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
