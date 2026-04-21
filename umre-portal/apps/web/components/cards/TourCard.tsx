"use client";
import Link from 'next/link';
import { useState } from 'react';
import { PlaneTakeoff, PlaneLanding, Info, Expand, X, Tag, Hotel } from 'lucide-react';
import { getImageUrl } from '@/utils/image-url';

interface TourCardProps {
    tour: any;
}

export default function TourCard({ tour }: TourCardProps) {
    const [showModal, setShowModal] = useState(false);

    // Helper to format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return { full: 'Tarih Belirlenmedi', day: '', date: '' };
        const d = new Date(dateString);
        return {
            full: d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' }),
            date: d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
            day: d.toLocaleDateString('tr-TR', { weekday: 'short' })
        };
    };

    const pricing = tour.pricing ? (typeof tour.pricing === 'string' ? JSON.parse(tour.pricing) : tour.pricing) : {};
    
    // Check both plural and singular for API compatibility
    const baseStartDate = tour.startDates?.[0] || tour.startDate || null;
    const startDate = baseStartDate ? formatDate(baseStartDate) : null;
    const returnDate = baseStartDate
        ? formatDate(new Date(new Date(baseStartDate).getTime() + (tour.durationDays * 86400000)).toISOString())
        : null;

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                {/* Header Strip */}
                <div className="bg-slate-50 border-b px-3 py-2 md:px-4 md:py-2 flex justify-between items-center">
                    <div className="flex flex-col">
                        <div className="font-bold text-slate-700 text-xs md:text-sm">
                            <span className="text-blue-600">{tour.title}</span>
                            <span className="px-1 md:px-2 text-gray-400">&gt;</span>
                            {tour.durationDays} GÜN
                        </div>
                        {tour.shortDescription && (
                            <p className="text-[10px] text-gray-400 font-medium italic mt-0.5 line-clamp-1">
                                {tour.shortDescription}
                            </p>
                        )}
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
                            tour.airline && <span className="text-[10px] font-bold text-gray-400">{tour.airline}</span>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 border-b">
                    {/* Left: Flight Dates */}
                    <div className="bg-white border rounded-md p-2 md:p-3 flex flex-col justify-center gap-2">
                        <div className="flex items-center gap-2">
                            <PlaneTakeoff className="text-gray-400" size={16} />
                            <div>
                                <div className="text-[10px] md:text-xs text-gray-500 leading-none">Gidiş:</div>
                                <div className="font-semibold text-gray-800 text-xs md:text-sm" suppressHydrationWarning>{startDate ? startDate.full : 'Tarih Sorunuz'}</div>
                            </div>
                        </div>
                        <div className="w-full h-px bg-gray-100"></div>
                        <div className="flex items-center gap-2">
                            <PlaneLanding className="text-gray-400" size={16} />
                            <div>
                                <div className="text-[10px] md:text-xs text-gray-500 leading-none">Dönüş:</div>
                                <div className="font-semibold text-gray-800 text-xs md:text-sm" suppressHydrationWarning>{returnDate ? returnDate.full : 'Tarih Sorunuz'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Hotels */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex gap-2 items-center md:items-start">
                            <img
                                src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=100&h=100"
                                className="w-10 h-10 md:w-14 md:h-14 rounded-md object-cover flex-shrink-0"
                                alt="Medine"
                            />
                            <div className="min-w-0">
                                <div className="font-bold text-xs">Medine</div>
                                <div className="text-[10px] text-gray-500 leading-none mb-0.5">3 Gece</div>
                                <div className="text-xs text-gray-700 font-medium truncate">Grand Mercure</div>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center md:items-start">
                            <img
                                src="https://images.unsplash.com/photo-1565552629477-e254f39b1a08?auto=format&fit=crop&q=80&w=100&h=100"
                                className="w-10 h-10 md:w-14 md:h-14 rounded-md object-cover flex-shrink-0"
                                alt="Mekke"
                            />
                            <div className="min-w-0">
                                <div className="font-bold text-xs">Mekke</div>
                                <div className="text-[10px] text-gray-500 leading-none mb-0.5">{tour.durationDays - 3} Gece</div>
                                <div className="text-xs text-gray-700 font-medium truncate">Swissotel</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-3 py-2 md:px-4 md:py-3 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
                    <div className="w-full md:w-auto flex justify-between md:block items-center">
                        <div className="text-lg md:text-xl font-bold text-emerald-600 leading-none">
                            {tour.priceFrom ? `${Number(tour.priceFrom).toLocaleString()} ${tour.currency}` : 'Fiyat Sorunuz'}
                        </div>
                        <div className="text-[10px] text-gray-400 md:text-left text-right">Başlangıç fiyatı</div>
                    </div>

                    <div className="hidden md:block text-xs text-emerald-600 font-medium text-center bg-emerald-50 px-2 py-1 rounded">
                        Türkiye'den <span className="font-bold">İç Hat Bağlantı</span>.
                    </div>

                    <div className="w-full md:w-auto flex gap-2">
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex-1 md:flex-none justify-center border border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-2 py-1.5 md:px-3 md:py-1.5 rounded-md flex items-center gap-1.5 transition-colors text-xs font-medium"
                        >
                            <Expand size={14} />
                            <span className="md:inline">Hızlı İncele</span>
                        </button>
                        <Link
                            href={`/turlar/${tour.slug}`}
                            className="flex-1 md:flex-none justify-center border border-gray-300 text-gray-600 hover:bg-gray-50 px-2 py-1.5 md:px-3 md:py-1.5 rounded-md flex items-center gap-1.5 transition-colors text-xs font-medium"
                        >
                            <Info size={14} />
                            Detaylar
                        </Link>
                    </div>
                </div>
            </div>
                 {/* Quick View Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-fadeIn shadow-2xl transition-all">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-5 right-5 p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-900 transition-all z-10"
                        >
                            <X size={18} />
                        </button>

                        <div className="p-6 md:p-10">
                            {/* Modal Header */}
                            <div className="text-center mb-8">
                                <h3 className="text-lg md:text-xl font-black mb-2 text-gray-900 uppercase tracking-tight">{tour.title}</h3>
                                <div className="flex justify-center items-center gap-3 text-gray-500 font-bold text-[10px] md:text-xs tracking-widest">
                                    <span className="bg-gray-100 px-3 py-1 rounded-full">{tour.durationDays} GÜN - {tour.durationDays - 1} GECE</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600/30"></span>
                                    <span className="uppercase">
                                        {tour.airlines && tour.airlines.length > 0 
                                            ? tour.airlines.map((a: any) => a.name).join(' & ') + ' ile Ulaşım'
                                            : (tour.airline ? `${tour.airline} ile Ulaşım` : 'Ulaşım Dahil')
                                        }
                                    </span>
                                </div>
                            </div>

                            {/* Flight Details Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                                <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 md:p-6 text-center group hover:border-primary-100 transition-colors relative overflow-hidden">
                                    <div className="flex justify-center gap-2 mb-3">
                                        {tour.airlines && tour.airlines.length > 0 ? (
                                            tour.airlines.map((airline: any) => (
                                                <img 
                                                    key={airline.id}
                                                    src={getImageUrl(airline.logoUrl)} 
                                                    className="h-14 md:h-20 object-contain mb-2" 
                                                    alt={airline.name} 
                                                />
                                            ))
                                        ) : (
                                            <PlaneTakeoff className="text-primary-600/50 group-hover:text-primary-600 transition-colors" size={20} />
                                        )}
                                    </div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Gidiş Uçuşu</div>
                                    <div className="font-bold text-gray-800 text-sm md:text-base mb-1" suppressHydrationWarning>{startDate ? startDate.full : 'Tarih Sorunuz'}</div>
                                    <div className="text-[10px] font-bold text-gray-400">İstanbul &bull; Medine</div>
                                </div>
                                <div className="hidden md:flex bg-gray-50/50 border border-gray-100 rounded-2xl p-6 text-center flex-col justify-center relative">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2">Transfer Bilgisi</div>
                                    <div className="font-bold text-gray-800 text-sm mb-1">Medine - Mekke</div>
                                    <div className="text-[10px] font-bold text-primary-600/70">Hızlı Tren Transferi</div>
                                    <div className="absolute left-0 top-1/2 -translate-x-1/2 w-4 h-4 bg-white border border-gray-100 rounded-full hidden md:block"></div>
                                    <div className="absolute right-0 top-1/2 translate-x-1/2 w-4 h-4 bg-white border border-gray-100 rounded-full hidden md:block"></div>
                                </div>
                                <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 md:p-6 text-center group hover:border-primary-100 transition-colors relative overflow-hidden">
                                    <div className="flex justify-center gap-2 mb-3">
                                        {tour.airlines && tour.airlines.length > 0 ? (
                                            tour.airlines.map((airline: any) => (
                                                <img 
                                                    key={airline.id}
                                                    src={getImageUrl(airline.logoUrl)} 
                                                    className="h-14 md:h-20 object-contain mb-2" 
                                                    alt={airline.name} 
                                                />
                                            ))
                                        ) : (
                                            <PlaneLanding className="text-primary-600/50 group-hover:text-primary-600 transition-colors" size={20} />
                                        )}
                                    </div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Dönüş Uçuşu</div>
                                    <div className="font-bold text-gray-800 text-sm md:text-base mb-1" suppressHydrationWarning>{returnDate ? returnDate.full : 'Tarih Sorunuz'}</div>
                                    <div className="text-[10px] font-bold text-gray-400">Cidde &bull; İstanbul</div>
                                </div>
                            </div>

                            {/* Pricing Section */}
                            <div className="mb-10">
                                <h4 className="flex items-center gap-3 font-black text-sm md:text-base mb-6 text-gray-900 uppercase tracking-widest">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <Tag size={16} />
                                    </div>
                                    Tur Ücretlendirmesi
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    {(pricing ? [
                                        { label: 'Single Oda', price: pricing.single ? `${Number(pricing.single).toLocaleString()} ${tour.currency}` : 'Sorunuz', note: '*kişi başı' },
                                        { label: 'İkili Oda', price: pricing.double ? `${Number(pricing.double).toLocaleString()} ${tour.currency}` : 'Sorunuz', note: '*kişi başı' },
                                        { label: 'Üçlü Oda', price: pricing.triple ? `${Number(pricing.triple).toLocaleString()} ${tour.currency}` : 'Sorunuz', note: '*kişi başı' },
                                        { label: 'Dörtlü Oda', price: pricing.quad ? `${Number(pricing.quad).toLocaleString()} ${tour.currency}` : 'Sorunuz', note: '*kişi başı' },
                                        { label: '0-2 Yaş', price: pricing.child_0_2 ? `${Number(pricing.child_0_2).toLocaleString()} ${tour.currency}` : 'Sorunuz', note: '*yataksız' },
                                        { label: '3-6 Yaş', price: pricing.child_3_6 ? `${Number(pricing.child_3_6).toLocaleString()} ${tour.currency}` : 'Sorunuz', note: '*yataksız' }
                                    ] : []).map((p, i) => (
                                        <div key={i} className="bg-gray-50/30 border border-gray-100 rounded-2xl p-4 text-center hover:border-emerald-200 hover:bg-white transition-all group">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-2 group-hover:text-gray-500 transition-colors">{p.label}</div>
                                            <div className="font-black text-emerald-600 text-base md:text-lg mb-1">{p.price}</div>
                                            <div className="text-[8px] font-bold text-gray-400 uppercase">{p.note}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                             <div className="mb-4">
                                <h4 className="flex items-center gap-3 font-black text-sm md:text-base mb-6 text-gray-900 uppercase tracking-widest">
                                    <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                                        <Hotel size={16} />
                                    </div>
                                    Konaklama Detayları
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex gap-4 p-4 bg-gray-50/30 border border-gray-100 rounded-2xl group hover:border-primary-100 transition-all">
                                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0 shadow-sm">
                                            <img src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=150&h=150" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Medine" />
                                        </div>
                                        <div className="min-w-0 py-1">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Medine Konaklaması</div>
                                            <div className="font-bold text-gray-900 text-sm md:text-base mb-0.5 truncate">{tour.medineHotelName || 'Merkezi Hoteller'}</div>
                                            <div className="text-[10px] font-bold text-gray-500 mb-2">3 GECE KONAKLAMA</div>
                                            <div className="flex text-yellow-400 text-xs">★★★★★</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 bg-gray-50/30 border border-gray-100 rounded-2xl group hover:border-primary-100 transition-all">
                                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0 shadow-sm">
                                            <img src="https://images.unsplash.com/photo-1565552629477-e254f39b1a08?auto=format&fit=crop&q=80&w=150&h=150" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Mekke" />
                                        </div>
                                        <div className="min-w-0 py-1">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Mekke Konaklaması</div>
                                            <div className="font-bold text-gray-900 text-sm md:text-base mb-0.5 truncate">{tour.mekkeHotelName || 'Merkezi Hoteller'}</div>
                                            <div className="text-[10px] font-bold text-gray-500 mb-2">{tour.durationDays - 3} GECE KONAKLAMA</div>
                                            <div className="flex text-yellow-400 text-xs">★★★★★</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50/50 px-6 md:px-10 py-5 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full md:w-auto px-10 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-gray-200"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
