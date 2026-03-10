import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '../components/global/Header';
import Footer from '../components/global/Footer';
import { SiteSettingsProvider } from '../context/SiteSettingsContext';
import PageContent from '../components/layout/PageContent';
import GoogleTranslate from '../components/global/GoogleTranslate';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
    title: 'Umre ve Turizm Portalı',
    description: 'En iyi umre ve kültür turları',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr">
            <body className={inter.className}>
                <SiteSettingsProvider>
                    <GoogleTranslate />
                    <Header />
                    <PageContent>
                        {children}
                    </PageContent>
                    <Footer />
                </SiteSettingsProvider>
            </body>
        </html>
    );
}
