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

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    const faviconUrl = settings.faviconUrl 
        ? (settings.faviconUrl.startsWith('http') ? settings.faviconUrl : `${process.env.NEXT_PUBLIC_API_URL || ''}${settings.faviconUrl}`) 
        : '/favicon.ico';

    return {
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kasriroyal.com'),
        title: {
            default: 'Kasri Royal | Umre ve Turizm',
            template: '%s | Kasri Royal',
        },
        description: 'Kasri Royal ile kutsal topraklara güvenli ve konforlu yolculuk yapın. En iyi umre paketleri, VIP umre hizmetleri ve kültür turları için doğru adresiniz.',
        keywords: ['umre', 'umre turları', 'VIP umre', 'Kasri Royal', 'Mekke', 'Medine', 'hac', 'kutsal topraklar', 'umre paketleri'],
        authors: [{ name: 'Kasri Royal Turizm' }],
        creator: 'Kasri Royal',
        publisher: 'Kasri Royal',
        icons: {
            icon: faviconUrl,
            shortcut: faviconUrl,
            apple: faviconUrl,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            type: 'website',
            locale: 'tr_TR',
            url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kasriroyal.com',
            siteName: 'Kasri Royal',
            title: 'Kasri Royal | Umre ve Turizm',
            description: 'Kasri Royal ile kutsal topraklara güvenli ve konforlu yolculuk yapın. En iyi umre paketleri, VIP umre hizmetleri ve kültür turları.',
            images: [
                {
                    url: '/logo.png',
                    width: 1200,
                    height: 630,
                    alt: 'Kasri Royal Logo',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Kasri Royal | Umre ve Turizm',
            description: 'Kasri Royal ile kutsal topraklara güvenli ve konforlu yolculuk yapın.',
            images: ['/logo.png'],
        },
        alternates: {
            canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://kasriroyal.com',
        },
    };
}

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
