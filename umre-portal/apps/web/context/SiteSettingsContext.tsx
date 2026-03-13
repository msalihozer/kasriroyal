"use client";
import { createContext, useContext, useEffect, useState } from 'react';

interface SiteSettings {
    logoUrl?: string;
    faviconUrl?: string;
    footerDiyanetImageUrl?: string;
    footerAgencyImageUrl?: string;
    socialLinks?: {
        instagram?: string;
        facebook?: string;
        whatsapp?: string;
        youtube?: string;
        x?: string;
        tiktok?: string;
    };
}

const SiteSettingsContext = createContext<any>({});

export const useSiteSettings = () => useContext(SiteSettingsContext);

export const SiteSettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [settings, setSettings] = useState({});

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/site-settings`);
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (error) {
                console.error("Failed to fetch site settings:", error);
            }
        };

        fetchSettings();
    }, []);

    return (
        <SiteSettingsContext.Provider value={settings}>
            {children}
        </SiteSettingsContext.Provider>
    );
};
