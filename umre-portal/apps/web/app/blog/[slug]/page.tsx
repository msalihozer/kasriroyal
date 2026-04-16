import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getImageUrl } from '@/utils/image-url';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';
import BlogShareButtons from '@/components/blog/BlogShareButtons';

async function getPost(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/posts/${slug}`, {
            cache: 'no-store'
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (err) {
        console.error(err);
    }
    return null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = await getPost(params.slug);
    if (!post) return {};

    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kasriroyal.com').replace(/\/$/, '');
    const description = post.excerpt || `${(post.content || '').replace(/<[^>]+>/g, '').slice(0, 155)}...`;
    const imageUrl = post.coverImageUrl
        ? (post.coverImageUrl.startsWith('http') ? post.coverImageUrl : `${process.env.NEXT_PUBLIC_API_URL || ''}${post.coverImageUrl}`)
        : `${baseUrl}/logo.png`;

    return {
        title: post.title,
        description,
        openGraph: {
            type: 'article',
            title: post.title,
            description,
            url: `${baseUrl}/blog/${params.slug}`,
            publishedTime: post.createdAt,
            modifiedTime: post.updatedAt,
            images: [{ url: imageUrl, alt: post.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: `${baseUrl}/blog/${params.slug}`,
        },
    };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);

    if (!post) {
        notFound();
    }

    const publishDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : null;

    // Calculate read time (rough estimate)
    const readTime = Math.ceil((post.content?.length || 0) / 1000) || 1;

    // Sharing URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kasriroyal.com';
    const postUrl = `${baseUrl}/blog/${params.slug}`;

    return (
        <article className="min-h-screen bg-[#f8f9fa] font-sans pb-20">
            {/* Navigation Bar (Sticky) */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 shadow-sm">
                <div className="container mx-auto px-4 max-w-4xl flex items-center justify-between">
                    <Link
                        href="/blog"
                        className="flex items-center text-gray-600 hover:text-primary-700 transition-colors font-medium group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Blog'a Dön
                    </Link>
                    <div className="flex items-center gap-4">
                        <BlogShareButtons url={postUrl} title={post.title} />
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <header className="bg-white pb-12 pt-12 border-b border-gray-100">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    {post.category && (
                        <div className="mb-6">
                            <span className="inline-block bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
                                {post.category.name}
                            </span>
                        </div>
                    )}

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm md:text-base font-medium">
                        {publishDate && (
                            <div className="flex items-center gap-2">
                                <Calendar size={18} className="text-primary-500" />
                                <time suppressHydrationWarning>{publishDate}</time>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Clock size={18} className="text-primary-500" />
                            <span>{readTime} dk okuma</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={18} className="text-primary-500" />
                            <span>{post.viewCount || 0} okuma</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            {post.coverImageUrl && (
                <div className="container mx-auto px-4 max-w-5xl -mt-8 mb-12 relative z-10">
                    <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                        <img
                            src={getImageUrl(post.coverImageUrl)}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="container mx-auto px-4 max-w-3xl">
                <div
                    className="prose prose-lg prose-slate md:prose-xl max-w-none 
                    prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 
                    prose-p:text-gray-600 prose-p:leading-relaxed 
                    prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-xl prose-img:shadow-lg prose-img:w-full prose-img:object-cover
                    prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-gray-700
                    first-letter:text-5xl first-letter:font-bold first-letter:text-primary-600 first-letter:mr-3 first-letter:float-left
                    "
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Sharing Section */}
                <div className="mt-12 p-8 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-1">Bu Yazıyı Paylaşın</h4>
                        <p className="text-gray-500 text-sm">Faydalı bulduysanız sevdiklerinizle paylaşabilirsiniz.</p>
                    </div>
                    <BlogShareButtons url={postUrl} title={post.title} />
                </div>

                {/* Tags or Footer Info */}
                <div className="mt-16 pt-8 border-t border-gray-200">
                    <p className="text-gray-400 text-sm text-center italic">
                        Bu içerik bilgilendirme amaçlıdır. Detaylı bilgi için uzmanlarımızla iletişime geçebilirsiniz.
                    </p>
                </div>
            </div>
        </article>
    );
}
