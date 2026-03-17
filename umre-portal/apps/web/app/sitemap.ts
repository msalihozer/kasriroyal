import { MetadataRoute } from 'next';

async function getPosts() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/posts`, { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            return data.data || [];
        }
    } catch (err) {
        console.error(err);
    }
    return [];
}

async function getPages() {
    try {
        // Fetching VIP Umre and other special pages
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/pages`, { cache: 'no-store' });
        if (res.ok) {
            return await res.json();
        }
    } catch (err) {
        console.error(err);
    }
    return [];
}

async function getTours() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/tours`, { cache: 'no-store' });
        if (res.ok) {
            return await res.json();
        }
    } catch (err) {
        console.error(err);
    }
    return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kasriroyal.com').replace(/\/$/, '');

    try {
        // Static Sitemap Entries
        const staticRoutes = [
            '',
            '/hakkimizda',
            '/iletisim',
            '/blog',
            '/turlar',
            '/oteller',
            '/kurumsal/kvkk',
            '/kurumsal/gizlilik-politikasi',
            '/kurumsal/cerez-politikasi',
            '/kurumsal/mesafeli-satis',
            '/kurumsal/iptal-iade',
            '/kurumsal/kullanim-kosullari',
            '/vip-umre',
        ].map(route => ({
            url: `${baseUrl}${route}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: route === '' ? 1 : 0.8,
        }));

        // Dynamic Sitemaps
        const [posts, pages, tours] = await Promise.all([
            getPosts(),
            getPages(),
            getTours(),
        ]);

        const postRoutes = posts
            .filter((p: any) => p.slug)
            .map((post: any) => ({
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.6,
            }));

        const pageRoutes = Array.isArray(pages) ? pages
            .filter((p: any) => p.slug)
            .map((page: any) => ({
                url: `${baseUrl}/vip-umre/${page.slug}`,
                lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            })) : [];

        const tourRoutes = Array.isArray(tours) ? tours
            .filter((p: any) => p.slug)
            .map((tour: any) => ({
                url: `${baseUrl}/turlar/${tour.slug}`,
                lastModified: tour.updatedAt ? new Date(tour.updatedAt) : new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            })) : [];

        return [
            ...staticRoutes,
            ...postRoutes,
            ...pageRoutes,
            ...tourRoutes,
        ];
    } catch (error) {
        console.error("Sitemap generation failed:", error);
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily' as const,
                priority: 1,
            }
        ];
    }
}
