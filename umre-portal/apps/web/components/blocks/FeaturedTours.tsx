"use client";
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { getImageUrl } from '@/utils/image-url';

export default function FeaturedTours({ data }: { data: { title?: string, items: any[] } }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    if (!data.items || data.items.length === 0) return null;

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300; // Card width estimate
            scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    const handleScroll = () => {
        if (!scrollRef.current) return;

        const container = scrollRef.current;
        const containerCenter = container.getBoundingClientRect().width / 2;

        const items = Array.from(container.children);
        let minDistance = Infinity;
        let newActiveIndex = 0;

        items.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            // Calculate center of the item relative to the viewport
            const itemCenter = rect.left + rect.width / 2;
            const containerLeft = container.getBoundingClientRect().left;
            // Center of container in viewport
            const centerPoint = containerLeft + containerCenter;

            const distance = Math.abs(itemCenter - centerPoint);

            if (distance < minDistance) {
                minDistance = distance;
                newActiveIndex = index;
            }
        });

        if (newActiveIndex !== activeIndex) {
            setActiveIndex(newActiveIndex);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ctaRef.current) {
            observer.observe(ctaRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Initial check for active index
    useEffect(() => {
        handleScroll();
    }, []);

    return (
        <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#bda569 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center mb-8 md:mb-10 relative">
                    <span className="text-[#bda569] font-bold tracking-widest text-[#10px] md:text-xs uppercase mb-1 md:mb-2">KEŞFETMENİZİ BEKLEYEN</span>
                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 text-center drop-shadow-sm">{data.title || "Öne Çıkan Turlar"}</h2>
                    <div className="w-24 h-1.5 bg-[#bda569] mt-6 rounded-full shadow-sm"></div>
                </div>

                <div className="relative -mx-4 md:mx-0 group/slider">
                    {/* Navigation Buttons - Visible on all screens, absolute positioned */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-2 md:left-16 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 bg-white/80 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center text-[#bda569] hover:bg-[#bda569] hover:text-white transition-all duration-300 border border-white/50 opacity-90 md:opacity-0 md:group-hover/slider:opacity-100 md:-translate-x-1/2 hover:scale-110"
                        aria-label="Önceki"
                    >
                        <ChevronLeft size={32} />
                    </button>

                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-2 md:right-16 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 bg-white/80 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center text-[#bda569] hover:bg-[#bda569] hover:text-white transition-all duration-300 border border-white/50 opacity-90 md:opacity-0 md:group-hover/slider:opacity-100 md:translate-x-1/2 hover:scale-110"
                        aria-label="Sonraki"
                    >
                        <ChevronRight size={32} />
                    </button>
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex gap-6 overflow-x-auto pb-16 pt-8 px-[10vw] md:px-[calc(50%-180px)] snap-x snap-mandatory hide-scrollbar"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {data.items.map((tour: any, idx: number) => {
                            const isActive = idx === activeIndex;
                            const startDate = tour.startDates?.[0]
                                ? new Date(tour.startDates[0]).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
                                : 'Tarih Sorunuz';

                            const coverImage = tour.thumbnailUrl || (tour.gallery && Array.isArray(tour.gallery) && tour.gallery.length > 0 ? tour.gallery[0] : null);

                            return (
                                <Link
                                    href={`/turlar/${tour.slug}`}
                                    key={idx}
                                    draggable={false}
                                    className={`min-w-[260px] md:min-w-[300px] snap-center rounded-3xl shadow-xl bg-white overflow-hidden transition-all duration-500 ease-out transform border border-gray-100
                                        ${isActive ? 'scale-105 opacity-100 z-10 shadow-2xl ring-1 ring-[#bda569]/30' : 'scale-95 opacity-60 hover:opacity-90 grayscale-[0.3] hover:grayscale-0'}
                                    `}
                                >
                                    <div className="h-40 md:h-48 bg-gray-200 relative overflow-hidden">
                                        <img
                                            src={coverImage ? getImageUrl(coverImage) : 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23cccccc%22%2F%3E%3C%2Fsvg%3E'}
                                            className="w-full h-full object-cover"
                                            alt={tour.title}
                                            draggable={false}
                                        />
                                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full text-[9px] md:text-[10px] font-bold text-[#bda569] uppercase tracking-widest shadow-sm">
                                            {tour.category?.name || 'UMRE'}
                                        </div>
                                    </div>

                                    <div className="p-4 md:p-5 flex flex-col justify-between h-[160px] md:h-[170px]">
                                        <div>
                                            <div className="flex items-center text-gray-500 text-[10px] md:text-xs mb-2 font-medium tracking-wide">
                                                <Calendar size={12} className='mr-1' />
                                                <span suppressHydrationWarning>{startDate}</span>
                                                <span className="mx-1 md:mx-2">•</span>
                                                <Clock size={12} className='mr-1' />
                                                <span>{tour.durationDays} Gün</span>
                                            </div>
                                            <h3 className="text-base md:text-lg font-bold text-gray-900 leading-snug mb-1 md:mb-2 line-clamp-2 font-serif">{tour.title}</h3>
                                        </div>

                                        <div className="flex items-end justify-between mt-auto">
                                            <div>
                                                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Başlangıç</span>
                                                <div className="text-xl font-bold text-[#bda569]">
                                                    {tour.priceFrom ? `${Number(tour.priceFrom).toLocaleString()} ${tour.currency}` : 'Sorunuz'}
                                                </div>
                                            </div>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-[#bda569] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Custom Tour CTA Removed as per request (replaced by embedded form) */}

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section >
    );
}
