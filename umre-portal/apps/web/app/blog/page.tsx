import Link from 'next/link';
import type { Metadata } from 'next';
import { getImageUrl } from '@/utils/image-url';

export const metadata: Metadata = {
    title: 'Blog ve Haberler',
    description: 'Umre, Mekke, Medine ve kutsal topraklar hakkında güncel blog yazıları, rehber bilgileri ve haberler. Kasri Royal blog köşesi.',
    alternates: {
        canonical: 'https://kasriroyal.com/blog',
    },
};



async function getPosts(sort: string = 'desc') {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/posts?sort=${sort}`, {
            cache: 'no-store'
        });
        if (res.ok) {
            const data = await res.json();
            return data.data || [];
        }
    } catch (err) {
        console.error(err);
    }
    return [];
}

export default async function BlogPage({ searchParams }: { searchParams: { sort?: string } }) {
    const currentSort = searchParams.sort || 'desc';
    const posts = await getPosts(currentSort);

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-black text-white py-20 relative overflow-hidden mb-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 uppercase !text-white drop-shadow-lg">Blog ve Haberler</h1>
                    <p className="!text-white text-lg max-w-2xl mx-auto drop-shadow-md">
                        Kutsal topraklar ve umre ibadeti hakkında güncel bilgiler, rehberler ve haberler.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {/* Filters / Sort */}
                <div className="flex justify-between items-center mb-10 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium">
                        Toplam <span className="text-gray-900 font-bold">{posts.length}</span> yazı bulundu
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Sıralama:</span>
                        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
                            <Link
                                href={`/blog?sort=desc`}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${currentSort === 'desc' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                YENİDEN ESKİYE
                            </Link>
                            <Link
                                href={`/blog?sort=asc`}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${currentSort === 'asc' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                ESKİDEN YENİYE
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {posts.map((post: any) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                            <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
                                {post.coverImageUrl ? (


                                    // ...
                                    <div className="h-56 overflow-hidden relative">
                                        <img
                                            src={getImageUrl(post.coverImageUrl)}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-56 bg-gray-200 flex items-center justify-center text-gray-400">
                                        Görsel Yok
                                    </div>
                                )}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="font-bold text-xl mb-2 group-hover:text-primary-600 transition-colors">
                                        {post.title}
                                    </h3>
                                    {post.createdAt && (
                                        <time className="text-xs text-gray-500 mb-3 block" suppressHydrationWarning>
                                            {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                                        </time>
                                    )}
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                        {post.excerpt}
                                    </p>
                                    <span className="text-primary-600 text-sm font-medium mt-auto inline-flex items-center">
                                        Devamını Oku
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-16 bg-gray-50 rounded-xl">
                        <p className="text-gray-500 text-lg">Henüz blog yazısı bulunmamaktadır.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
