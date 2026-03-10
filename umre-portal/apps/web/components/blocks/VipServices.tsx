"use client";
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface VipServicesProps {
    data: {
        title?: string;
        items: any[];
    };
}

export default function VipServices({ data }: VipServicesProps) {
    if (!data.items || data.items.length === 0) return null;

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                        {data.title || "VIP Umre Hizmetleri"}
                    </h2>
                    <div className="w-24 h-1 bg-[#bda569] mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Size özel ayrıcalıklı hizmetlerimizle ibadetinizi konfor içinde gerçekleştirin.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {data.items.slice(0, 3).map((page: any) => (
                        <div key={page.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col">
                            <div className="h-40 md:h-56 relative overflow-hidden bg-gray-200 shrink-0">
                                {page.imageUrl ? (
                                    <Image
                                        src={page.imageUrl}
                                        alt={page.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                        <span className="text-3xl opacity-20 font-serif">Royal</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                                <h3 className="absolute bottom-3 left-4 right-4 text-lg md:text-xl font-bold text-white font-serif tracking-wide leading-tight">
                                    {page.title}
                                </h3>
                            </div>
                            <div className="p-4 md:p-6 flex flex-col grow">
                                <p className="text-gray-600 mb-4 line-clamp-2 text-xs md:text-sm leading-relaxed grow">
                                    {page.summary || "Bu hizmet hakkında detaylı bilgi için butona tıklayınız."}
                                </p>
                                <Link
                                    href={`/vip-umre/${page.slug}`}
                                    className="inline-flex items-center gap-2 text-[#bda569] font-bold tracking-wider text-[10px] md:text-xs hover:text-[#a38b55] transition-colors group/btn mt-auto"
                                >
                                    İNCELE <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/vip-umre"
                        className="inline-block border-2 border-[#bda569] text-[#bda569] px-8 py-3 rounded-full font-bold hover:bg-[#bda569] hover:text-white transition-all duration-300"
                    >
                        TÜM HİZMETLERİMİZİ İNCELEYİN
                    </Link>
                </div>
            </div>
        </section>
    );
}
