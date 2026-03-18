import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

async function getPage(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/pages/${slug}`, {
            cache: 'no-store'
        });

        if (res.ok) {
            const text = await res.text();
            try {
                return text ? JSON.parse(text) : null;
            } catch (e) {
                console.warn('Failed to parse page JSON:', e);
                return null;
            }
        }

        if (res.status === 404) return null;
    } catch (err) {
        console.error(err);
    }
    return null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const page = await getPage(params.slug);
    if (!page) return {};

    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kasriroyal.com').replace(/\/$/, '');
    const description = page.seoDescription || page.excerpt || page.title;

    return {
        title: page.title,
        description,
        openGraph: {
            title: page.title,
            description,
            url: `${baseUrl}/${params.slug}`,
        },
        alternates: {
            canonical: `${baseUrl}/${params.slug}`,
        },
    };
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
    const page = await getPage(params.slug);

    if (!page) {
        notFound();
    }

    // Extract content from blocks if it exists as { content: "..." }
    const htmlContent = page.blocks?.content || '';

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">{page.title}</h1>

            <div
                className="prose prose-lg prose-blue max-w-none mb-12"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            <CommentSection type="Page" entityId={page.id} entityName={page.title} />
        </div>
    );
}

import CommentSection from '@/components/global/CommentSection';
