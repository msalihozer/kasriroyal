"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Check, MapPin, Globe, Star } from 'lucide-react';
import CommentSection from '@/components/global/CommentSection';

export default function HotelDetailPage({ params }: { params: { slug: string } }) {
    const [hotel, setHotel] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        fetchHotel();
    }, []);

    const fetchHotel = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/hotels/${params.slug}`);
            if (res.ok) {
                const data = await res.json();
                setHotel(data);
            } else {
                setHotel(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container mx-auto px-4 py-20 text-center">Yükleniyor...</div>;
    if (!hotel) return <div className="container mx-auto px-4 py-20 text-center">Otel bulunamadı.</div>;

    const images = [hotel.imageUrl, ...(hotel.gallery || [])].filter(Boolean);
    if (images.length === 0) images.push('/placeholder-hotel.jpg');
    const getFullUrl = (url: string) => url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${url}`;

    const nextImage = () => setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1);
    const prevImage = () => setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1);

    const groupedFeatures = hotel?.features?.reduce((acc: any, feature: any) => {
        const cat = feature.category || 'Diğer Özellikler';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(feature);
        return acc;
    }, {}) || {};

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Link href="/oteller" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
                <ChevronLeft size={18} />
                Otellere Dön
            </Link>

            {/* Header: Title and Location */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                    {hotel.stars && (
                        <div className="flex text-yellow-500">
                            {'★'.repeat(hotel.stars)}
                        </div>
                    )}
                    <span className="text-gray-300">|</span>
                    <span className="text-primary-600 font-bold tracking-wide uppercase">{hotel.location?.name || 'Konum Belirtilmedi'}</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">{hotel.title}</h1>
                {hotel.locationText && (
                    <p className="text-base text-gray-600 flex items-center justify-center gap-2">
                        <MapPin size={18} className="text-gray-400" />
                        {hotel.locationText}
                    </p>
                )}
            </div>

            {/* Slider / Gallery (In the middle) */}
            <div className="space-y-4 mb-10 max-w-4xl mx-auto">
                <div className="h-[300px] md:h-[450px] bg-gray-100 rounded-2xl overflow-hidden relative group shadow-lg">
                    <img
                        src={getFullUrl(images[activeImage])}
                        alt={hotel.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full hover:bg-white text-gray-800 shadow-md transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full hover:bg-white text-gray-800 shadow-md transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                        {activeImage + 1} / {images.length}
                    </div>
                </div>

                {images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center">
                        {images.map((img: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`relative flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-primary-600 ring-2 ring-primary-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                            >
                                <img src={getFullUrl(img)} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Details and Features */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100 mb-8">
                <div className="prose prose-base md:prose-lg max-w-none text-gray-600 mb-10 leading-relaxed" dangerouslySetInnerHTML={{ __html: hotel.description || '' }} />

                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8 border border-gray-100">
                    <h3 className="font-bold text-xl md:text-2xl mb-6 text-gray-900 border-b pb-4">Otelin Sunduğu İmkanlar</h3>
                    {Object.keys(groupedFeatures).length > 0 ? (
                        <div className="space-y-8">
                            {Object.entries(groupedFeatures).map(([category, features]: any) => (
                                <div key={category}>
                                    <h4 className="font-semibold text-xl text-gray-800 mb-4">{category}</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {features.map((feature: any) => (
                                            <div key={feature.id} className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:border-primary-200 transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 text-primary-600">
                                                    <Check size={16} />
                                                </div>
                                                <span className="font-medium">{feature.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Özellik bilgisi bulunmamaktadır.</p>
                    )}
                </div>

                {hotel.websiteUrl && (
                    <div className="flex justify-center mb-4">
                        <a
                            href={hotel.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all hover:scale-[1.02] shadow-lg"
                        >
                            <Globe size={20} />
                            Otel Web Sitesini Ziyaret Et
                        </a>
                    </div>
                )}
            </div>

            {/* Map Section */}
            {(hotel.lat && hotel.lng) && (
                <div className="mb-8 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <MapPin className="text-primary-600" />
                        Konum Haritası
                    </h2>
                    <div className="rounded-xl overflow-hidden h-[450px] shadow-inner bg-gray-100 relative">
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src={`https://maps.google.com/maps?q=${hotel.lat},${hotel.lng}&z=15&output=embed`}
                            className="absolute inset-0 w-full h-full"
                        >
                        </iframe>
                    </div>
                </div>
            )}

            {/* Comments Section */}
            <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Star className="text-primary-600" />
                    Değerlendirmeler & Yorumlar
                </h2>
                <CommentSection type="Hotel" entityId={hotel.id} entityName={hotel.title} />
            </div>
        </div>
    );
}
