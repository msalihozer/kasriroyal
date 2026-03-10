import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { getImageUrl } from '@/utils/image-url';

export default function LatestPosts({ data }: { data: { title?: string, items: any[] } }) {
    if (!data.items || data.items.length === 0) return null;

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">{data.title || "Blogdan Son Yazılar"}</h2>
                    <div className="w-24 h-1 bg-primary-500 mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.items.slice(0, 3).map((post: any, idx: number) => (
                        <div key={idx} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1">
                            <div className="aspect-video bg-gray-200 overflow-hidden relative">
                                <img
                                    src={post.coverImageUrl ? getImageUrl(post.coverImageUrl) : 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2000&auto=format&fit=crop'}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-xs text-[#bda569] font-bold uppercase tracking-wider mb-3">
                                    <Calendar size={12} />
                                    <span>{new Date(post.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <h3 className="text-xl font-serif font-bold mb-3 text-gray-900 group-hover:text-[#bda569] transition-colors leading-tight">
                                    <Link href={`/blog/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h3>
                                <p className="text-gray-500 line-clamp-2 mb-4 text-sm leading-relaxed">{post.excerpt}</p>
                                <Link href={`/blog/${post.slug}`} className="inline-block text-sm font-bold text-gray-900 border-b-2 border-[#bda569]/30 hover:border-[#bda569] transition-colors pb-1">
                                    DEVAMINI OKU
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
