"use client";
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HotelGallery({ images, title, apiBaseUrl }: { images: string[], title: string, apiBaseUrl: string }) {
    const [activeImage, setActiveImage] = useState(0);

    const getFullUrl = (url: string) => {
        if (!url) return '/placeholder-hotel.jpg';
        return url.startsWith('http') ? url : `${apiBaseUrl}${url}`;
    };

    const nextImage = () => setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1);
    const prevImage = () => setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1);

    return (
        <div className="space-y-4 mb-10 max-w-4xl mx-auto">
            <div className="h-[300px] md:h-[500px] bg-gray-100 rounded-3xl overflow-hidden relative group shadow-2xl border border-gray-100">
                <img
                    src={getFullUrl(images[activeImage])}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-full hover:bg-white text-gray-800 shadow-xl transition-all hover:scale-110 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                        >
                            <ChevronLeft size={28} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-full hover:bg-white text-gray-800 shadow-xl transition-all hover:scale-110 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                        >
                            <ChevronRight size={28} />
                        </button>
                    </>
                )}
                <div className="absolute bottom-6 right-6 bg-black/60 text-white px-4 py-1.5 rounded-full text-sm backdrop-blur-md font-bold tracking-wider">
                    {activeImage + 1} / {images.length}
                </div>
            </div>

            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto py-4 scrollbar-hide justify-center px-4">
                    {images.map((img: string, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => setActiveImage(idx)}
                            className={`relative flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-sm ${activeImage === idx ? 'border-primary-600 ring-4 ring-primary-100 scale-105' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                        >
                            <img src={getFullUrl(img)} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
