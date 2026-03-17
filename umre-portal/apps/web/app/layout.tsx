import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '../components/global/Header';
import Footer from '../components/global/Footer';
import WhatsAppButton from '../components/global/WhatsAppButton';
import { SiteSettingsProvider } from '../context/SiteSettingsContext';
import PageContent from '../components/layout/PageContent';
import GoogleTranslate from '../components/global/GoogleTranslate';
import AnalyticsTracker from '../components/AnalyticsTracker';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
    title: 'Umre ve Turizm Portalı',
    description: 'En iyi umre ve kültür turları',
};

async function getSiteSettings() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/site-settings`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        if (res.ok) return await res.json();
    } catch (err) {
        console.error(err);
    }
    return {};
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const siteSettings = await getSiteSettings();

    return (
        <html lang="tr">
            <body className={inter.className}>
                <SiteSettingsProvider initialSettings={siteSettings}>
                    <AnalyticsTracker />
                    <GoogleTranslate />
                    <Header />
                    <PageContent>
                        {children}
                    </PageContent>
                    <Footer />
                    <WhatsAppButton />
                </SiteSettingsProvider>
            </body>
        </html>
    );
}
