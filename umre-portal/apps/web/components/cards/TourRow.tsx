"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Calendar, MapPin, ArrowRight, Clock, PlaneTakeoff, PlaneLanding, Info, Expand, X, Phone, MessageCircle, CheckCircle, BedDouble, Hotel } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { getImageUrl } from '@/utils/image-url';

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
                        {tour.shortDescription && (
                            <p className="text-[10px] md:text-xs text-gray-600 mt-1 line-clamp-1 italic">
                                {tour.shortDescription}
                            </p>
                        )}
                        <div className="text-[10px] md:text-xs font-semibold text-gray-500 mt-0.5 uppercase tracking-wider">
                            {tour.tourType?.name} &bull; {tour.durationDays} GÜN / {tour.durationNights} GECE
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {tour.airlines && tour.airlines.length > 0 ? (
                            tour.airlines.map((airline: any) => (
                                <a 
                                    key={airline.id}
                                    href={airline.websiteUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:scale-110 transition-transform"
                                >
                                    <img 
                                        src={getImageUrl(airline.logoUrl)} 
                                        className="h-8 md:h-14 object-contain bg-white rounded p-1 shadow-sm border border-gray-100" 
                                        alt={airline.name} 
                                        title={`${airline.name} - Web Sitesine Git`}
                                    />
                                </a>
                            ))
                        ) : (
                            tour.airline && <span className="text-xs md:text-sm font-bold text-blue-900">{tour.airline}</span>
                        )}
                    </div>
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
                                        <img src={getImageUrl(getLocationInfo(stays[0].locationId).imageUrl)} alt={getLocationInfo(stays[0].locationId).name} className="w-full h-full object-cover" />
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
                                        <img src={getImageUrl(getLocationInfo(stays[1].locationId).imageUrl)} alt={getLocationInfo(stays[1].locationId).name} className="w-full h-full object-cover" />
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
                        <div className="text-[10px] text-gray-400">Başlangıç fiyatı</div>
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
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" style={{ margin: 0 }}>
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh] relative border-8 border-white">
                        <button
                            onClick={toggleQuickView}
                            className="absolute top-4 right-4 p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-colors z-20 shadow-sm"
                        >
                            <X size={18} />
                        </button>
                        
                        {/* 1. Header - Clean & Minimalist */}
                        <div className="bg-white border-b border-gray-100 p-6 text-center">
                            <h3 className="font-black text-gray-900 text-lg md:text-xl uppercase tracking-widest mb-1">{tour.title}</h3>
                            <div className="flex items-center justify-center gap-3 text-gray-400 font-bold text-[10px] md:text-xs">
                                <span className="uppercase tracking-widest">{tour.durationNights} GECE / {tour.durationDays} GÜN</span>
                                <span className="w-1 h-1 rounded-full bg-primary-600/30"></span>
                                <span className="uppercase tracking-widest text-primary-600/70">{tour.tourType?.name}</span>
                            </div>
                        </div>

                        <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar">
                            {/* 2. Flight / Travel Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                                <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 md:p-6 text-center group hover:border-primary-100 transition-all relative overflow-hidden">
                                    <div className="flex justify-center gap-2 mb-2">
                                        {tour.airlines && tour.airlines.length > 0 ? (
                                            tour.airlines.map((airline: any) => (
                                                <img 
                                                    key={airline.id}
                                                    src={getImageUrl(airline.logoUrl)} 
                                                    className="h-12 md:h-16 object-contain mb-2" 
                                                    alt={airline.name} 
                                                />
                                            ))
                                        ) : (
                                            <PlaneTakeoff className="mx-auto text-primary-600/50 group-hover:text-primary-600 transition-colors" size={20} />
                                        )}
                                    </div>
                                    <div className="text-gray-400 font-black text-[10px] mb-2 flex items-center justify-center gap-2 uppercase tracking-tighter">Gidiş Uçuş Bilgisi</div>
                                    <div className="font-black text-gray-800 text-sm md:text-base">{longDate(startObj)}</div>
                                    <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{tour.departureLocation || 'İstanbul'} &bull; {getLocationInfo(stays[0]?.locationId)?.name || 'Medine'}</div>
                                </div>
                                <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 md:p-6 text-center group hover:border-primary-100 transition-all relative overflow-hidden">
                                    <div className="flex justify-center gap-2 mb-2">
                                        {tour.airlines && tour.airlines.length > 0 ? (
                                            tour.airlines.map((airline: any) => (
                                                <img 
                                                    key={airline.id}
                                                    src={getImageUrl(airline.logoUrl)} 
                                                    className="h-12 md:h-16 object-contain mb-2" 
                                                    alt={airline.name} 
                                                />
                                            ))
                                        ) : (
                                            <PlaneLanding className="mx-auto text-primary-600/50 group-hover:text-primary-600 transition-colors" size={20} />
                                        )}
                                    </div>
                                    <div className="text-gray-400 font-black text-[10px] mb-2 flex items-center justify-center gap-2 uppercase tracking-tighter">Dönüş Uçuş Bilgisi</div>
                                    <div className="font-black text-gray-800 text-sm md:text-base">{longDate(endObj)}</div>
                                    <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{tour.returnLocation || 'Cidde'} &bull; {tour.departureLocation || 'İstanbul'}</div>
                                </div>
                            </div>

                            {/* 3. Konaklama */}
                            <div className="mb-10">
                                <h4 className="flex items-center gap-3 font-black text-gray-900 mb-6 text-xs md:text-sm uppercase tracking-widest">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center border border-gray-100">
                                        <BedDouble size={16} />
                                    </div>
                                    Konaklama Seçenekleri
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {stays.map((stay: any, idx: number) => {
                                        const loc = getLocationInfo(stay.locationId);
                                        const hotel = getHotelForLocation(stay.locationId);
                                        return (
                                            <div key={idx} className="flex gap-4 items-center bg-gray-50/30 border border-gray-100 p-3 rounded-2xl hover:border-primary-100 hover:bg-white transition-all group">
                                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                                                    {hotel?.imageUrl ? (
                                                        <img src={getImageUrl(hotel.imageUrl)} alt={hotel.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        hotel?.gallery && Array.isArray(hotel.gallery) && hotel.gallery[0] ? (
                                                            <img src={getImageUrl(hotel.gallery[0])} alt={hotel.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        ) : (
                                                            loc.imageUrl ? <img src={getImageUrl(loc.imageUrl)} alt={loc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full bg-gray-200 flex items-center justify-center"><Hotel className="text-gray-400" size={20} /></div>
                                                        )
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-black text-gray-900 text-xs md:text-sm uppercase tracking-tight truncate">{loc.name} <span className="text-gray-400 font-bold">({stay.nights} Gece)</span></div>
                                                    <div className="text-gray-600 text-[10px] md:text-xs font-bold truncate mb-1">{hotel?.title || 'Otel Belirtilmedi'}</div>
                                                    {hotel?.stars && renderStars(hotel.stars)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 4. Ücretler (Pricing) */}
                            <div className="mb-4">
                                <h4 className="flex items-center gap-3 font-black text-gray-900 mb-6 text-xs md:text-sm uppercase tracking-widest">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                        <CheckCircle size={16} />
                                    </div>
                                    Tur Paket Ücretleri
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
                                    {[
                                        { label: 'Single Oda', key: 'single', desc: '*Kişi başı' },
                                        { label: 'İkili Oda', key: 'double', desc: '*Kişi başı' },
                                        { label: 'Üçlü Oda', key: 'triple', desc: '*Kişi başı' },
                                        { label: 'Dörtlü Oda', key: 'quad', desc: '*Kişi başı' },
                                        { label: '0-2 Yaş', key: 'child_0_2', desc: '*Yataksız' },
                                        { label: '3-6 Yaş', key: 'child_3_6', desc: '*Yataksız' },
                                        { label: '7-11 Yaş', key: 'child_7_11', desc: '*Yataksız' },
                                    ].map((item) => {
                                        if (!pricing[item.key]) return null;
                                        return (
                                            <div key={item.key} className="bg-gray-50/30 border border-gray-100 rounded-2xl p-3 text-center hover:border-emerald-200 hover:bg-white transition-all group">
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 group-hover:text-gray-500 transition-colors">{item.label}</div>
                                                <div className="text-sm md:text-base font-black text-emerald-600 mb-0.5">{Number(pricing[item.key]).toLocaleString()} {tour.currency}</div>
                                                <div className="text-[8px] font-bold text-gray-400 uppercase leading-none">{item.desc}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* 5. Footer */}
                        <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between gap-3">
                            {settings.tourImportantNotes && (
                                <button
                                    onClick={() => setShowWarning(!showWarning)}
                                    className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                                >
                                    <Info size={14} /> Önemli Bilgiler
                                </button>
                            )}
                            <div className="flex flex-row gap-2 md:ml-auto w-full md:w-auto">
                                <a
                                    href={`https://wa.me/905555555555?text=Merhaba, ${tour.title} turu hakkında teklif almak istiyorum.`}
                                    target="_blank"
                                    className="flex-1 md:flex-none px-8 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
                                >
                                    <MessageCircle size={14} /> İletişim
                                </a>
                                <button
                                    onClick={toggleQuickView}
                                    className="flex-1 md:flex-none px-8 py-3 bg-gray-900 text-white rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-primary-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                                >
                                    <X size={14} /> Kapat
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
