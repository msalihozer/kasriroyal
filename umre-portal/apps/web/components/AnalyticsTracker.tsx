'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function generateSessionId(): string {
    const existing = localStorage.getItem('_sid');
    if (existing) return existing;
    const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('_sid', id);
    return id;
}

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const startTimeRef = useRef<number>(Date.now());
    const lastPathRef = useRef<string>('');

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const sessionId = generateSessionId();

        const sendPageView = (path: string, duration?: number) => {
            const payload: Record<string, unknown> = {
                path,
                referrer: document.referrer || undefined,
                sessionId,
            };
            if (duration !== undefined) payload.duration = duration;

            // sendBeacon kullan — sayfa kapanırken bile çalışır
            const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            navigator.sendBeacon(`${apiUrl}/api/analytics/pageview`, blob);
        };

        // Yeni sayfa — önceki sayfanın süresini gönder
        if (lastPathRef.current && lastPathRef.current !== pathname) {
            const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
            sendPageView(lastPathRef.current, duration);
        }

        // Yeni sayfa görüntülemesini kaydet
        startTimeRef.current = Date.now();
        lastPathRef.current = pathname;
        sendPageView(pathname);

        // Sayfa kapanınca süreyi gönder
        const handleUnload = () => {
            const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
            sendPageView(pathname, duration);
        };
        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, [pathname]);

    return null;
}
