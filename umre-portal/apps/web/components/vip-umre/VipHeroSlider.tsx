"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getImageUrl } from '@/utils/image-url';
import { motion, AnimatePresence } from "framer-motion";

interface VipHeroSliderProps {
    title: string;
    summary?: string;
    content?: string;
    images: string[];
}

export default function VipHeroSlider({ title, summary, content, images }: VipHeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // If no images provided, use a placeholder or return null
    if (!images || images.length === 0) {
        return null;
    }


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-[30vh] min-h-[280px] w-full bg-black overflow-hidden shadow-xl">
            {/* Background Slider */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={getImageUrl(images[currentIndex])}
                        alt="VIP Umre"
                        fill
                        sizes="100vw"
                        className="object-cover opacity-70"
                        priority
                    />
                </motion.div>
            </AnimatePresence>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-20 h-full flex items-end justify-center text-center pb-8 px-4">
                <div className="max-w-4xl mx-auto space-y-3">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-3xl md:text-4xl font-serif font-bold text-white tracking-wide drop-shadow-lg"
                    >
                        {title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto drop-shadow-md"
                    >
                        {summary ? (
                            <p>{summary}</p>
                        ) : (
                            <p>Konfor, huzur ve maneviyatı en üst seviyede yaşamanız için size özel hazırlanmış paketlerimizi keşfedin.</p>
                        )}
                        {/* If there is rich text content, render it but keep it white */}
                        {content && (
                            <div className="mt-6 prose prose-invert prose-lg max-w-none text-white/90" dangerouslySetInnerHTML={{ __html: content || '' }} />
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
