import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { getImageUrl } from '@/utils/image-url';

async function getPage(slug: string) {
    try {
        const res = await fetch(`${process.env.API_BASE_URL}/pages/${slug}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        return null;
    }
}

export default async function VipPageDetail({ params }: { params: { slug: string } }) {
    const page = await getPage(params.slug);

    if (!page) {
        notFound();
    }

    // Format date text
    const date = new Date(page.updatedAt || page.createdAt).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <article className="min-h-screen bg-white">
            {/* Header / Cover */}
            <div className="relative h-[50vh] min-h-[400px] w-full bg-gray-900">
                {page.imageUrl && (
                    <Image
                        src={getImageUrl(page.imageUrl)}
                        alt={page.title}
                        fill
                        sizes="100vw"
                        className="object-cover opacity-60"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                    <div className="container mx-auto max-w-4xl">
                        <Link
                            href="/vip-umre"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors text-sm font-medium uppercase tracking-wider"
                        >
                            <ArrowLeft size={16} /> VIP Umre'ye Dön
                        </Link>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-serif mb-6 leading-tight">
                            {page.title}
                        </h1>
                        <div className="flex items-center gap-6 text-white/70 text-sm">
                            <span className="flex items-center gap-2">
                                <Calendar size={16} /> {date}
                            </span>
                            {/* <span className="flex items-center gap-2">
                                <Clock size={16} /> 5 dk okuma
                            </span> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Content */}
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-3xl mx-auto">
                    {/* Summary Lead */}
                    {page.summary && (
                        <div className="text-xl md:text-2xl font-serif text-gray-600 mb-12 leading-relaxed italic border-l-4 border-[#bda569] pl-6">
                            {page.summary}
                        </div>
                    )}

                    {/* Main Content */}
                    <div
                        className="prose prose-lg md:prose-xl max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-loose prose-a:text-blue-600 prose-img:rounded-xl prose-img:shadow-lg prose-img:w-full prose-img:object-cover"
                        dangerouslySetInnerHTML={{ __html: page.content || '' }}
                    />
                </div>
            </div>
        </article>
    );
}
