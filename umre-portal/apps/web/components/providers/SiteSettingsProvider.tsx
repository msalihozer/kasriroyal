"use client";
import { createContext, useContext, useEffect, useState } from 'react';

const SiteSettingsContext = createContext<any>(null);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        // Fetch settings
        // setSettings(...)
    }, []);

    return (
        <SiteSettingsContext.Provider value={settings}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
