import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Admin Panel',
    description: 'Umre Portal Yönetim Paneli',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr">
            <body className={`${inter.className} min-h-screen bg-gray-50`}>
                {children}
            </body>
        </html>
    );
}
