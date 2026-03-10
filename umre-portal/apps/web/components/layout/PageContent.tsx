"use client";
import { usePathname } from 'next/navigation';

export default function PageContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === '/';

    return (
        <main className={`min-h-screen ${!isHome ? 'pt-32' : ''}`}>
            {children}
        </main>
    );
}
