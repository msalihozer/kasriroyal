"use client";
import React from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/utils/image-url';

interface PartnersSliderProps {
    data: {
        title?: string;
        items: any[];
    };
}

export default function PartnersSlider({ data }: PartnersSliderProps) {
    if (!data.items || data.items.length === 0) return null;

    // Duplicate items for seamless scrolling
    const logos = [...data.items, ...data.items, ...data.items];

    return (
        <section className="py-12 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-4 mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 font-serif">
                    {data.title || "Resmi Üyelikler ve Anlaşmalı Kurumlar"}
                </h2>
                <div className="w-24 h-1 bg-primary-500 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="relative w-full">
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

                <div className="flex animate-scroll gap-8 md:gap-16 w-max">
                    {logos.map((logo, idx) => (
                        <div
                            key={`${idx}-${logo.id || idx}`}
                            className="bg-white p-4 rounded-full shadow-md w-32 h-32 md:w-40 md:h-40 flex items-center justify-center border-2 border-primary-100 hover:border-primary-400 transition-colors duration-300"
                        >
                            <div className="relative w-20 h-20 md:w-28 md:h-28">
                                <Image
                                    src={getImageUrl(logo.imageUrl) || '/logo.png'}
                                    alt={logo.alt || 'Partner Logo'}
                                    fill
                                    sizes="(max-width: 768px) 100px, 150px"
                                    className="object-contain p-2"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
