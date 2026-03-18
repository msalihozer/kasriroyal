import { notFound } from 'next/navigation';
import CommentSection from '@/components/global/CommentSection';

async function getPage(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/pages/${slug}`, {
            cache: 'no-store'
        });

        if (res.ok) {
            const data = await res.json();
            return data;
        }

        if (res.status === 404) return null;
    } catch (err) {
        console.error(err);
    }
    return null;
}

export default async function KurumsalPage({ params }: { params: { slug: string } }) {
    const page = await getPage(params.slug);

    if (!page) {
        notFound();
    }

    // Extract content from blocks if it exists as { content: "..." }
    const htmlContent = page.blocks?.content || page.content || '';

    return (
        <div className="bg-gray-50 min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-secondary-900 border-b border-gray-100 pb-8">
                            {page.title}
                        </h1>

                        <div
                            className="prose prose-lg prose-secondary max-w-none text-gray-600 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    </div>
                </div>

                <div className="mt-12">
                    <CommentSection type="Page" entityId={page.id} entityName={page.title} />
                </div>
            </div>
        </div>
    );
}
