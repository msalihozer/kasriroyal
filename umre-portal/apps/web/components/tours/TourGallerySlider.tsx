"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface TourGallerySliderProps {
    images: string[];
}

export default function TourGallerySlider({ images }: TourGallerySliderProps) {
    const getFullUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${process.env.NEXT_PUBLIC_API_URL || ''}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!images || images.length === 0) return null;

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-4 md:p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-black text-gray-900 text-sm md:text-base uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></span>
                    Tur Görselleri
                </h3>
                <div className="flex gap-2">
                    <button 
                        onClick={prevSlide}
                        className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-primary-50 hover:text-primary-600 transition-all border border-gray-100"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-primary-50 hover:text-primary-600 transition-all border border-gray-100"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="relative h-[300px] md:h-[450px] w-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-gray-100 group">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={getFullUrl(images[currentIndex])}
                            alt={`Tour image ${currentIndex + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 66vw"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Progress Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setDirection(idx > currentIndex ? 1 : -1);
                                setCurrentIndex(idx);
                            }}
                            className={`h-1.5 transition-all duration-300 rounded-full ${
                                idx === currentIndex ? 'w-8 bg-white shadow-lg' : 'w-2 bg-white/50 hover:bg-white/80'
                            }`}
                        />
                    ))}
                </div>

                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            
            <p className="mt-4 text-center text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest italic">
                {currentIndex + 1} / {images.length} - Turumuzdan Kareler
            </p>
        </div>
    );
}
