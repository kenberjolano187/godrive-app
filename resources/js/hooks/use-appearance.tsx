import { useCallback, useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { SharedData } from '@/types';

export type Appearance = 'light' | 'dark' | 'system';

export const applyTheme = (appearance: Appearance) => {
    if (typeof window === 'undefined') return;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark);

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') return;
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const mediaQuery = () => {
    if (typeof window === 'undefined') return null;
    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = () => {
    applyTheme('system');
};

export function initializeTheme() {
    const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'system';
    applyTheme(savedAppearance);
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
    const { props } = usePage<SharedData>();
    const user = props.auth?.user;

    const [appearance, setAppearance] = useState<Appearance>(() => {
        if (user?.appearance) {
            return user.appearance as Appearance;
        }
        return 'system';
    });

    useEffect(() => {
        applyTheme(appearance);
        if (user) {
            localStorage.setItem('appearance', appearance);
            setCookie('appearance', appearance);
        }
    }, [appearance, user]);

    useEffect(() => {
        if (user?.appearance && user.appearance !== appearance) {
            setAppearance(user.appearance as Appearance);
        }
    }, [user?.appearance]);

    const updateAppearance = useCallback((mode: Appearance) => {
        setAppearance(mode);

        if (user) {
            router.post('/user/appearance', { appearance: mode }, {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ only: ['auth'] });
                }
            });
        }
    }, [user]);

    return { appearance, updateAppearance } as const;
}