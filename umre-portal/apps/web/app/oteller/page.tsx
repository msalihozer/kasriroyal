"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HotelsPage() {
    const [locations, setLocations] = useState<any[]>([]);
    const [activeLocation, setActiveLocation] = useState<string>('');
    const [hotels, setHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        if (activeLocation) {
            fetchHotels();
        }
    }, [activeLocation]);

    const fetchLocations = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/locations');
            if (res.ok) {
                const data = await res.json();
                setLocations(data || []);
                if (data && data.length > 0) {
                    setActiveLocation(data[0].id);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:4000/api/hotels?locationId=${activeLocation}`);
            if (res.ok) {
                const data = await res.json();
                setHotels(data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8 text-center">Otellerimiz</h1>

            {/* Dynamic Tabs */}
            <div className="flex justify-center gap-4 mb-12 flex-wrap">
                {locations.map((loc) => (
                    <button
                        key={loc.id}
                        onClick={() => setActiveLocation(loc.id)}
                        className={`px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md ${activeLocation === loc.id
                                ? 'bg-primary-600 text-white scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {loc.name}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-96 bg-gray-100 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {hotels.map((hotel: any) => (
                        <div key={hotel.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group h-[450px]">
                            <div className="h-56 bg-gray-200 relative overflow-hidden">
                                <img
                                    src={(hotel.gallery && hotel.gallery[0])
                                        ? (hotel.gallery[0].startsWith('http') ? hotel.gallery[0] : `http://localhost:4000${hotel.gallery[0]}`)
                                        : '/placeholder-hotel.jpg'}
                                    alt={hotel.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => { e.currentTarget.src = '/placeholder-hotel.jpg'; }}
                                />
                                {hotel.isFeatured && (
                                    <span className="absolute top-4 left-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">Öne Çıkan</span>
                                )}
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">{hotel.title}</h3>
                                    {hotel.stars && (
                                        <div className="text-yellow-400 flex text-sm">
                                            {'★'.repeat(hotel.stars)}
                                        </div>
                                    )}
                                </div>
                                <div className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                    <span className="truncate">{hotel.locationText || locations.find(l => l.id === activeLocation)?.name}</span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                                    {hotel.shortDescription || "Otel hakkında kısa bilgi bulunmamaktadır."}
                                </p>

                                <Link
                                    href={`/oteller/${hotel.slug}`}
                                    className="block w-full text-center bg-gray-900 text-white py-3 rounded-lg hover:bg-primary-600 transition-colors mt-auto font-medium"
                                >
                                    Detayları İncele
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && hotels.length === 0 && (
                <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl">
                    <p className="text-xl">Bu lokasyonda henüz listelenen otel bulunmamaktadır.</p>
                </div>
            )}
        </div>
    );
}
