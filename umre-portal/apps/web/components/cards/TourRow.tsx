"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Calendar, MapPin, ArrowRight, Clock, PlaneTakeoff, PlaneLanding, Info, Expand, X, Phone, MessageCircle, CheckCircle, BedDouble, Hotel } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

interface TourRowProps {
    tour: any;
    locationsMap?: any; // { [id]: { name, imageUrl } }
}

export default function TourRow({ tour, locationsMap }: TourRowProps) {
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const settings = useSiteSettings();

    // Helper to format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        const d = new Date(dateString);
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' });
    };

    const startDate = formatDate(tour.startDate);
    const endDate = formatDate(tour.endDate);

    // Derive dates
    const startObj = tour.startDate ? new Date(tour.startDate) : null;
    const endObj = tour.endDate ? new Date(tour.endDate) : null;
    // Format: 16 Şub 2026, Pzt
    const longDate = (d: Date | null) => d ? d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' }) : '-';


    // Helper to find hotel for a location from itinerary
    const getHotelForLocation = (locId: string) => {
        if (!tour.itinerary || !Array.isArray(tour.itinerary)) return null;
        const item = tour.itinerary.find((i: any) => i.locationId === locId && i.hotel);
        return item?.hotel;
    };

    const stays = tour.locationStays && Array.isArray(tour.locationStays) && tour.locationStays.length > 0
        ? tour.locationStays.slice(0, 3)
        : [];

    const toggleQuickView = () => setIsQuickViewOpen(!isQuickViewOpen);

    const getLocationInfo = (id: string) => {
        if (!locationsMap || !locationsMap[id]) return { name: 'Bilinmeyen Konum', imageUrl: null };
        if (typeof locationsMap[id] === 'string') return { name: locationsMap[id], imageUrl: null };
        return locationsMap[id];
    };

    // Parse pricing
    const pricing = tour.pricing ? (typeof tour.pricing === 'string' ? JSON.parse(tour.pricing) : tour.pricing) : {};

    const renderStars = (count: number) => {
        return (
            <div className="flex text-yellow-400 text-xs">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < count ? "fill-current" : "text-gray-300"}>★</span>
                ))}
            </div>
        );
    };

    const getFullUrl = (url?: string | null) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${process.env.NEXT_PUBLIC_API_URL || ''}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all group">
                {/* Simplified Card Content for List View */}
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-start gap-3">
                    <div className="flex-1">
                        <h3 className="text-base md:text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors uppercase leading-tight">
                            <Link href={`/turlar/${tour.slug}`}>
                                {tour.title}
                            </Link>
                        </h3>
                        <div className="text-[10px] md:text-xs font-semibold text-gray-500 mt-0.5 uppercase tracking-wider">
                            {tour.tourType?.name} &bull; {tour.durationDays} GÜN / {tour.durationNights} GECE
                        </div>
                    </div>
                    {tour.airline && (
                        <div className="shrink-0">
                            <span className="text-xs md:text-sm font-bold text-blue-900">{tour.airline}</span>
                        </div>
                    )}
                </div>

                <div className="p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="border border-gray-200 rounded-lg p-2.5 md:p-3 flex flex-col gap-2 relative hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-1.5 text-gray-600 mb-0.5">
                            <PlaneTakeoff size={14} className="text-gray-400" />
                            <span className="font-semibold text-xs">Gidiş:</span>
                            <span className="text-xs font-medium">{startDate}</span>
                        </div>
                        {stays[0] && (
                            <div className="flex gap-2.5 mt-auto">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-md bg-gray-100 overflow-hidden shrink-0 relative flex items-center justify-center border border-gray-100">
                                    {getLocationInfo(stays[0].locationId).imageUrl ? (
                                        <img src={getFullUrl(getLocationInfo(stays[0].locationId).imageUrl)} alt={getLocationInfo(stays[0].locationId).name} className="w-full h-full object-cover" />
                                    ) : <MapPin className="text-gray-400" size={16} />}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-bold text-gray-900 text-xs md:text-sm truncate">
                                        {getLocationInfo(stays[0].locationId).name} <span className="text-gray-400 font-normal">/ {stays[0].nights} Gece</span>
                                    </div>
                                    <div className="text-[10px] md:text-xs text-gray-500 line-clamp-1">
                                        {getHotelForLocation(stays[0].locationId)?.title || 'Otel Bilgisi Yok'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border border-gray-200 rounded-lg p-2.5 md:p-3 flex flex-col gap-2 relative hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-1.5 text-gray-600 mb-0.5">
                            <PlaneLanding size={14} className="text-gray-400" />
                            <span className="font-semibold text-xs">Dönüş:</span>
                            <span className="text-xs font-medium">{endDate}</span>
                        </div>
                        {stays[1] && (
                            <div className="flex gap-2.5 mt-auto">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-md bg-gray-100 overflow-hidden shrink-0 relative flex items-center justify-center border border-gray-100">
                                    {getLocationInfo(stays[1].locationId).imageUrl ? (
                                        <img src={getFullUrl(getLocationInfo(stays[1].locationId).imageUrl)} alt={getLocationInfo(stays[1].locationId).name} className="w-full h-full object-cover" />
                                    ) : <MapPin className="text-gray-400" size={16} />}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-bold text-gray-900 text-xs md:text-sm truncate">
                                        {getLocationInfo(stays[1].locationId).name} <span className="text-gray-400 font-normal">/ {stays[1].nights} Gece</span>
                                    </div>
                                    <div className="text-[10px] md:text-xs text-gray-500 line-clamp-1">
                                        {getHotelForLocation(stays[1].locationId)?.title || 'Otel Bilgisi Yok'}
                                    </div>
                                </div>
                            </div>
                        )}
                        {!stays[1] && (
                            <div className="text-xs text-gray-400 mt-auto">
                                {stays.length === 1 ? 'Tek merkez konaklama.' : 'Konaklama detayı girilmedi.'}
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center text-green-600 text-[10px] md:text-xs font-medium -mt-1 mb-2.5">
                    Türkiye'nin her şehrinden <span className="font-bold">İç Hat Bağlantı</span> bileti.
                </div>

                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="flex items-center justify-between w-full md:w-auto md:block">
                        <div className="text-lg md:text-xl font-bold text-green-600 leading-none">
                            {tour.priceFrom ? `${Number(tour.priceFrom).toLocaleString()} ${tour.currency}` : 'Fiyat Sorunuz'}
                        </div>
                        <div className="text-[10px] text-gray-400">İkili odada kişi başı</div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={toggleQuickView}
                            className="flex-1 md:flex-none border border-green-200 text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
                        >
                            <Expand size={14} /> <span className="whitespace-nowrap">Hızlı İncele</span>
                        </button>
                        {settings.tourImportantNotes && (
                            <button
                                onClick={() => setShowWarning(true)}
                                className="flex-1 md:flex-none border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
                            >
                                <Info size={14} /> <span className="whitespace-nowrap">Önemli</span>
                            </button>
                        )}
                        <Link
                            href={`/turlar/${tour.slug}`}
                            className="flex-1 md:flex-none border border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 px-4 py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
                        >
                            <Info size={14} /> Detaylar
                        </Link>
                    </div>
                </div>
            </div>

            {/* NEW Full-Featured Quick View Modal */}
            {isQuickViewOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm" style={{ margin: 0 }}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh] relative">
                        <button
                            onClick={toggleQuickView}
                            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors z-10"
                        >
                            <X size={20} />
                        </button>
                        {/* 1. Header */}
                        <div className="bg-[#bda569] text-white p-4 text-center font-bold text-lg uppercase tracking-wide">
                            {tour.title} &gt; {tour.durationNights} GECE - {tour.durationDays} GÜN
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            {/* 2. Flight / Travel Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
                                <div className="border border-gray-200 rounded-xl p-4 text-center">
                                    <div className="text-gray-400 text-sm mb-2 flex items-center justify-center gap-2"><PlaneTakeoff size={16} /> Gidiş</div>
                                    <div className="font-bold text-gray-800 text-lg">{longDate(startObj)}</div>
                                    <div className="text-sm text-gray-500 mt-1">{tour.departureLocation || 'İstanbul'} - {getLocationInfo(stays[0]?.locationId)?.name || 'Medine'}</div>
                                </div>
                                <div className="border border-gray-200 rounded-xl p-4 text-center">
                                    <div className="text-gray-400 text-sm mb-2 flex items-center justify-center gap-2"><PlaneLanding size={16} /> Dönüş</div>
                                    <div className="font-bold text-gray-800 text-lg">{longDate(endObj)}</div>
                                    <div className="text-sm text-gray-500 mt-1">{tour.returnLocation || 'Cidde'} - {tour.departureLocation || 'İstanbul'}</div>
                                </div>
                                {/* Optional: Add 'Ara Geçiş' if data exists logic */}
                            </div>

                            {/* 3. Konaklama */}
                            <div className="mb-8">
                                <h4 className="flex items-center gap-2 font-bold text-gray-700 mb-4 text-lg">
                                    <BedDouble className="text-gray-400" /> Konaklama
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {stays.map((stay: any, idx: number) => {
                                        const loc = getLocationInfo(stay.locationId);
                                        const hotel = getHotelForLocation(stay.locationId);
                                        return (
                                            <div key={idx} className="flex gap-4 items-start">
                                                <div className="w-24 h-24 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                                                    {hotel?.imageUrl ? (
                                                        <img src={getFullUrl(hotel.imageUrl)} alt={hotel.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        hotel?.gallery && Array.isArray(hotel.gallery) && hotel.gallery[0] ? (
                                                            <img src={getFullUrl(hotel.gallery[0])} alt={hotel.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            loc.imageUrl ? <img src={getFullUrl(loc.imageUrl)} alt={loc.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200 flex items-center justify-center"><Hotel className="text-gray-400" /></div>
                                                        )
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 text-lg">{loc.name} <span className="text-gray-500 text-sm font-normal">({stay.nights} Gece)</span></div>
                                                    <div className="text-gray-600 font-medium">{hotel?.title || 'Otel Belirtilmedi'}</div>
                                                    {hotel?.stars && renderStars(hotel.stars)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 4. Ücretler (Pricing) */}
                            <div className="mb-6">
                                <h4 className="flex items-center gap-2 font-bold text-gray-700 mb-4 text-lg">
                                    <CheckCircle className="text-gray-400" /> Ücretler
                                </h4>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Single Oda', key: 'single', desc: '*Kişi başı' },
                                        { label: 'İkili Oda', key: 'double', desc: '*Kişi başı' },
                                        { label: 'Üçlü Oda', key: 'triple', desc: '*Kişi başı' },
                                        { label: '0-2 Yaş', key: 'child_0_2', desc: '*Yataksız' },
                                        { label: '3-6 Yaş', key: 'child_3_6', desc: '*Yataksız' },
                                        { label: '7-11 Yaş', key: 'child_7_11', desc: '*Yataksız' },
                                    ].map((item) => {
                                        if (!pricing[item.key]) return null;
                                        return (
                                            <div key={item.key} className="border border-gray-200 rounded-xl p-4 text-center hover:border-[#bda569] transition-colors">
                                                <div className="text-sm font-bold text-gray-600 mb-1">{item.label}</div>
                                                <div className="text-xl font-bold text-green-600">{Number(pricing[item.key]).toLocaleString()} {tour.currency}</div>
                                                <div className="text-xs text-gray-400 mt-1">{item.desc}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* 5. Footer */}
                        <div className="p-4 border-t bg-gray-50 flex justify-between gap-3 rounded-b-xl">
                            {settings.tourImportantNotes && (
                                <button
                                    onClick={() => setShowWarning(!showWarning)}
                                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200 transition-colors flex items-center gap-2"
                                >
                                    <Info size={18} /> Önemli Bilgiler
                                </button>
                            )}
                            <div className="flex gap-3 ml-auto">
                                <a
                                    href={`https://wa.me/905555555555?text=Merhaba, ${tour.title} turu hakkında teklif almak istiyorum.`}
                                    target="_blank"
                                    className="px-6 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center gap-2"
                                >
                                    <MessageCircle size={18} /> İletişime Geç
                                </a>
                                <button
                                    onClick={toggleQuickView}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-white hover:border-gray-400 transition-colors flex items-center gap-2"
                                >
                                    <X size={18} /> Kapat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Warning Modal - Independent of Quick View */}
            {showWarning && settings.tourImportantNotes && (
                <div className="fixed inset-0 bg-black/80 z-[60] p-4 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-red-100 bg-red-50">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-red-700">
                                <Info className="text-red-600" size={24} /> Önemli Bilgilendirme
                            </h3>
                            <button
                                onClick={() => setShowWarning(false)}
                                className="p-2 hover:bg-red-100 rounded-full transition-colors text-red-600"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto prose prose-red max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: settings.tourImportantNotes }}></div>
                        <div className="p-4 border-t bg-gray-50 text-center">
                            <button
                                onClick={() => setShowWarning(false)}
                                className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                            >
                                Okudum, Anladım
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
