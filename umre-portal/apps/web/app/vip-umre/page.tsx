import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import VipMinimalHero from '../../components/vip-umre/VipMinimalHero';
import VipPackagesList from '../../components/vip-umre/VipPackagesList';

import fs from 'fs';
import path from 'path';

async function getPages() {
    try {
        const res = await fetch(`${process.env.API_BASE_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api`}/pages`, { cache: 'no-store' });
        if (!res.ok) return [];
        return await res.json();
    } catch (e) {
        return [];
    }
}

async function getVipImages() {
    return []; // No longer needed for hero slider, but keeping function to avoid large diffs if needed later
}

export default async function VipUmrePage() {
    const pages = await getPages();

    // Find the landing page content
    const landingPage = pages.find((p: any) => p.slug === 'vip-umre-landing');

    // Filter pages for VIP Umre section
    const vipPages = pages.filter((p: any) =>
        p.status === 'published' &&
        p.slug !== 'vip-umre-landing' && // Exclude the landing content page itself
        (
            p.category === 'vip-umre' ||
            // Fallback for pages created before category field
            ['deluxe-umre', 'butik-umre', 'royal-lux-umre'].includes(p.slug)
        )
    );

    return (
        <main className="min-h-screen bg-white">
            {/* Minimal Typography Hero */}
            <VipMinimalHero
                title={landingPage?.title || "VIP UMRE NEDİR?"}
                summary={landingPage?.summary}
                content={landingPage?.content}
            />

            {/* Editorial List Layout */}
            <VipPackagesList vipPages={vipPages} />
        </main>
    );
}
