"use client";
import React from 'react';
import { MessageSquarePlus, Star, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import CommentModal from './CommentModal';

export default function TestimonialsCarousel({ data }: { data: { title?: string, items: any[] } }) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    if (!data.items || data.items.length === 0) return null;

    return (
        <section className="py-20 bg-white relative overflow-hidden">
            <CommentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">
                            {data.title || "Misafirlerimiz Ne Diyor?"}
                        </h2>
                        <div className="w-20 h-1 bg-primary-500 mt-4 rounded-full"></div>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        <MessageSquarePlus size={18} />
                        <span>Yorum Yap</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {data.items.slice(0, 3).map((item: any, idx: number) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-primary-200 transition-colors relative group">
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-8 text-6xl text-primary-100 font-serif opacity-50 group-hover:text-primary-200 transition-colors">
                                &rdquo;
                            </div>

                            <div className="flex text-yellow-400 mb-6 space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        fill={i < item.rating ? "currentColor" : "none"}
                                        className={i < item.rating ? "text-yellow-400" : "text-gray-300"}
                                    />
                                ))}
                            </div>

                            <p className="mb-8 text-gray-600 italic leading-relaxed relative z-10">
                                "{item.comment}"
                            </p>

                            <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                                <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                                    {item.avatarUrl ? (
                                        <Image
                                            src={item.avatarUrl.startsWith('http') ? item.avatarUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${item.avatarUrl}`}
                                            alt={item.fullName}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{item.fullName}</div>
                                    <div className="text-xs text-primary-600 font-medium uppercase tracking-wider">Misafir</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
