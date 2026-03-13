"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/utils/image-url';
import { ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VipPackagesList({ vipPages }: { vipPages: any[] }) {
    if (!vipPages || vipPages.length === 0) return null;

    return (
        <div className="w-full bg-white pb-24">
            {vipPages.map((page: any, idx: number) => {
                const isEven = idx % 2 === 0;

                return (
                    <section key={page.id || idx} className="py-8 md:py-12 px-4 md:px-8 first:pt-4 border-b border-gray-50 last:border-0 relative overflow-hidden">
                        {/* Alternating Layout */}
                        <div className={`container mx-auto flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-center gap-6 lg:gap-10`}>

                            {/* Image Side */}
                            <motion.div
                                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="w-full md:w-5/12 relative"
                            >
                                <div className="aspect-[16/9] md:aspect-[4/3] max-w-sm mx-auto relative rounded-xl overflow-hidden shadow-lg">
                                    {page.imageUrl ? (
                                        <div 
                                            className="w-full h-full bg-cover bg-center bg-no-repeat bg-fixed hover:scale-105 transition-transform duration-[1.5s]"
                                            style={{ backgroundImage: `url('${getImageUrl(page.imageUrl)}')` }}
                                            title={page.title}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <span className="text-gray-300 text-3xl font-serif">Royal</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors duration-500"></div>
                                </div>
                                {/* Decorative Element */}
                                <div className={`absolute -bottom-4 -z-10 w-full h-full border border-[#bda569]/30 rounded-xl ${isEven ? '-left-4' : '-right-4'}`}></div>
                            </motion.div>

                            {/* Content Side */}
                            <motion.div
                                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                className="w-full md:w-7/12 text-center md:text-left"
                            >
                                <div className="flex items-center justify-center md:justify-start gap-1 text-[#bda569] mb-4">
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                </div>

                                <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-3 md:mb-4 leading-tight">
                                    {page.title}
                                </h2>

                                <div className="text-gray-500 text-sm md:text-base leading-relaxed mb-5 md:mb-6 font-light">
                                    {page.summary || "Bu özel paketimiz hakkında detaylı bilgi almak için inceleyebilirsiniz. Konforlu ve huzurlu bir ibadet deneyimi sizi bekliyor."}
                                </div>

                                <Link
                                    href={`/vip-umre/${page.slug}`}
                                    className="inline-flex group items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm rounded-full transition-all hover:bg-[#bda569] hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    <span className="font-medium tracking-wide">DETAYLARI İNCELE</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>

                        </div>
                    </section>
                );
            })}
        </div>
    );
}
