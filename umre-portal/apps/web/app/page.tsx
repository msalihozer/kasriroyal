import BlockRenderer from '../components/blocks/BlockRenderer';

async function getHomePageData() {
    // In a real production app, use absolute URL from env
    const API_BASE = 'http://localhost:4000/api';

    // Helper for safe fetch
    const safeFetch = (url: string) =>
        fetch(url, { next: { revalidate: 60 } })
            .then(async res => {
                if (!res.ok) return [];
                const text = await res.text();
                return text ? JSON.parse(text) : [];
            })
            .catch(err => {
                console.error(`Fetch error for ${url}:`, err);
                return [];
            });

    try {
        const [toursRes, hotelsRes, testimonials, faq, postsRes, settingsRes, pagesRes] = await Promise.all([
            safeFetch(`${API_BASE}/tours`),
            safeFetch(`${API_BASE}/hotels`),
            safeFetch(`${API_BASE}/testimonials`),
            safeFetch(`${API_BASE}/faq`),
            safeFetch(`${API_BASE}/posts`),
            safeFetch(`${API_BASE}/site-settings`),
            safeFetch(`${API_BASE}/pages`),
        ]);

        // Normalize data (some APIs return { data: [], total: ... }, others return [])
        const tours = Array.isArray(toursRes) ? toursRes : (toursRes?.data || []);
        const hotels = Array.isArray(hotelsRes) ? hotelsRes : (hotelsRes?.data || []);
        const posts = Array.isArray(postsRes) ? postsRes : (postsRes?.data || []);
        const pages = Array.isArray(pagesRes) ? pagesRes : (pagesRes?.data || []);
        const settings = settingsRes || {};

        // Filter VIP Umre pages
        const vipPages = pages.filter((p: any) =>
            p.status === 'published' &&
            p.slug !== 'vip-umre-landing' &&
            (p.category === 'vip-umre' || ['deluxe-umre', 'butik-umre', 'royal-lux-umre'].includes(p.slug))
        );

        return {
            blocks: [
                {
                    type: 'heroVideo',
                    data: {
                        title: settings.heroTitle || 'Mukaddes Topraklara Yolculuk',
                        subtitle: settings.heroSubtitle || 'Huzurlu bir yolculuk için...',
                        videoUrl: settings.heroVideoUrl,
                        titleColor: settings.heroTitleColor
                    }
                },
                { type: 'searchBox', data: {} },
                { type: 'customTourForm', data: { title: 'Kendi Turunuzu Oluşturun' } },
                { type: 'featuredTours', data: { title: 'Popüler Tur Paketleri', items: tours.slice(0, 10) } },
                { type: 'vipServices', data: { title: 'VIP Umre Hizmetleri', items: vipPages } },
                { type: 'latestPosts', data: { title: 'Blog Yazıları', items: posts.slice(0, 3) } },
                // { type: 'partnersSlider', data: { title: '', items: settings.footerLogos || [] } },
                // { type: 'featuredHotels', data: { title: 'Anlaşmalı Otellerimiz', items: hotels.slice(0, 3) } },
                { type: 'testimonials', data: { title: 'Misafirlerimiz Ne Diyor?', items: Array.isArray(testimonials) ? testimonials.filter((t: any) => t.isFeatured) : [] } },
                { type: 'faqSection', data: {} },
                { type: 'feedbackCTA', data: {} }
            ]
        };
    } catch (error) {
        console.error("Homepage data fetch error:", error);
        return {
            blocks: [
                { type: 'heroVideo', data: { title: 'Mukaddes Topraklara Yolculuk' } },
                { type: 'searchBox', data: {} },
            ]
        };
    }
}

export default async function Home() {
    const pageData = await getHomePageData();

    return (
        <main className="bg-gray-100 min-h-screen">
            <BlockRenderer blocks={pageData.blocks} />
        </main>
    );
}
