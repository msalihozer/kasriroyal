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

export const SiteSettingsProvider = ({ 
    children, 
    initialSettings = {} 
}: { 
    children: React.ReactNode, 
    initialSettings?: any 
}) => {
    const [settings, setSettings] = useState(initialSettings);

    useEffect(() => {
        // If we didn't get initial settings, or we want to refresh them
        if (Object.keys(initialSettings).length === 0) {
            const fetchSettings = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/site-settings`);
                    if (res.ok) {
                        const data = await res.json();
                        setSettings(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch site settings:", error);
                }
            };

            fetchSettings();
        }
    }, [initialSettings]);

    return (
        <SiteSettingsContext.Provider value={settings}>
            {children}
        </SiteSettingsContext.Provider>
    );
};
