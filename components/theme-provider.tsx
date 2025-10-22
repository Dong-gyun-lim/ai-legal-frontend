'use client';

import * as React from 'react';
import {
    ThemeProvider as NextThemesProvider,
    type ThemeProviderProps, // ✅ next-themes가 제공하는 정확한 타입
} from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    // props에 attribute / defaultTheme / enableSystem / storageKey 전부 포함됨
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
