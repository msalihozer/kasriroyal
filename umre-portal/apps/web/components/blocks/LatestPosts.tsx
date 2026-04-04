import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { getImageUrl } from '@/utils/image-url';

export default function LatestPosts({ data }: { data: { title?: string, items: any[] } }) {
    if (!data.items || data.items.length === 0) return null;

    return (
        <section className="py-10 bg-gray-50 border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center mb-8">
                    <span className="text-[#bda569] font-bold tracking-widest text-[10px] uppercase mb-1">GÜNCEL YAZILAR</span>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 text-center">{data.title || "Blogdan Son Yazılar"}</h2>
                    <div className="w-16 h-1 bg-[#bda569] mt-3 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.items.slice(0, 3).map((post: any, idx: number) => (
                        <div key={idx} className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
                            <div className="aspect-video bg-gray-50 overflow-hidden relative">
                                <img
                                    src={post.coverImageUrl ? encodeURI(getImageUrl(post.coverImageUrl)) : 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2000&auto=format&fit=crop'}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="p-5">
                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                                    <Calendar size={10} />
                                    <span>{new Date(post.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <h3 className="text-lg font-serif font-bold mb-2 text-gray-900 group-hover:text-[#bda569] transition-colors leading-tight line-clamp-2">
                                    <Link href={`/blog/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h3>
                                <p className="text-gray-500 line-clamp-2 mb-3 text-xs leading-relaxed">{post.excerpt}</p>
                                <Link href={`/blog/${post.slug}`} className="text-[11px] font-bold text-[#bda569] hover:underline tracking-widest">
                                    DEVAMINI OKU &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
