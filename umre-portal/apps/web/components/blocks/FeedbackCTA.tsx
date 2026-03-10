"use client";
import React from 'react';
import Link from 'next/link';
import { MessageSquareText } from 'lucide-react';

export default function FeedbackCTA() {
    return (
        <section className="py-16 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pattern-dots"></div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6 flex justify-center">
                        <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
                            <MessageSquareText size={40} className="text-primary-200" />
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Sizlerin Memnuniyeti Bizim İçin Önemli</h2>
                    <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">
                        Hizmetlerimizle ilgili her türlü görüş, öneri ve isteklerinizi bize iletebilirsiniz.
                        Size daha iyi hizmet verebilmek için düşüncelerinizi önemsiyoruz.
                    </p>

                    <Link
                        href="/iletisim"
                        className="inline-flex items-center gap-3 bg-white text-primary-900 hover:bg-primary-50 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg group"
                    >
                        <span>Görüş ve İsteklerinizi İletiniz</span>
                        <MessageSquareText size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
