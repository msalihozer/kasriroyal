"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VipCardGrid({ vipPages }: { vipPages: any[] }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="container mx-auto px-4 mt-8 relative z-20">
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {vipPages.length > 0 ? (
                    vipPages.map((page: any, idx: number) => (
                        <motion.div
                            key={page.id || idx}
                            variants={item}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100"
                        >
                            {/* Smaller Card Image */}
                            <div className="h-48 relative overflow-hidden bg-gray-200">
                                {page.imageUrl ? (
                                    <Image
                                        src={page.imageUrl}
                                        alt={page.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <span className="text-3xl opacity-20 font-serif">Royal</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                            </div>

                            {/* Content - Minimalist */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h2 className="text-xl font-bold text-gray-800 font-serif mb-3 group-hover:text-[#bda569] transition-colors">{page.title}</h2>
                                <div className="text-gray-500 mb-4 text-sm line-clamp-3 leading-relaxed">
                                    {page.summary || "Bu sayfa için özet girilmemiş."}
                                </div>
                                <div className="mt-auto pt-4 border-t border-gray-50">
                                    <Link
                                        href={`/vip-umre/${page.slug}`}
                                        className="inline-flex items-center gap-2 text-[#bda569] font-medium text-sm hover:text-[#a38b55] transition-colors group/btn"
                                    >
                                        İncele <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full bg-white p-12 rounded-xl shadow-sm text-center">
                        <h3 className="text-xl font-medium text-gray-500">Henüz içerik eklenmemiş.</h3>
                        <p className="text-gray-400 mt-2">Lütfen daha sonra tekrar kontrol ediniz.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
