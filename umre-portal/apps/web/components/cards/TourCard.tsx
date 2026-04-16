"use client";
import Link from 'next/link';
import { useState } from 'react';
import { PlaneTakeoff, PlaneLanding, Info, Expand, X, Tag, Hotel } from 'lucide-react';

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

    const startDate = tour.startDates?.[0] ? formatDate(tour.startDates[0]) : null;
    const returnDate = tour.startDates?.[0]
        ? formatDate(new Date(new Date(tour.startDates[0]).getTime() + (tour.durationDays * 86400000)).toISOString())
        : null;

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                {/* Header Strip */}
                <div className="bg-slate-50 border-b px-3 py-2 md:px-4 md:py-2 flex justify-between items-center">
                    <div className="font-bold text-slate-700 text-xs md:text-sm">
                        <span className="text-blue-600">{tour.title}</span>
                        <span className="px-1 md:px-2 text-gray-400">&gt;</span>
                        {tour.durationDays} GÜN
                    </div>
                    <div className="flex items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Turkish_Airlines_logo_2019_compact.svg/1200px-Turkish_Airlines_logo_2019_compact.svg.png" className="h-3 md:h-5 object-contain" alt="THY" />
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
                        <div className="text-[10px] text-gray-400 md:text-left text-right">İkili odada kişi başı</div>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-fadeIn">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-4 md:p-8">
                            {/* Modal Header */}
                            <div className="text-center mb-4 md:mb-8">
                                <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">{tour.title}</h3>
                                <div className="flex justify-center items-center gap-2 md:gap-4 text-gray-600 font-medium text-[10px] md:text-base">
                                    <span>{tour.durationDays} Gün - {tour.durationDays - 1} Gece</span>
                                    <span>•</span>
                                    <span>THY ile Gidiş Dönüş</span>
                                </div>
                            </div>

                            {/* Flight Details Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
                                <div className="border rounded-xl p-3 md:p-6 text-center">
                                    <PlaneTakeoff className="mx-auto mb-2 text-emerald-600" size={24} />
                                    <div className="text-[10px] text-gray-500 mb-0.5">Gidiş</div>
                                    <div className="font-bold text-sm md:text-lg mb-0.5" suppressHydrationWarning>{startDate ? startDate.full : 'Tarih Sorunuz'}</div>
                                    <div className="text-[10px] text-gray-500">İstanbul - Medine</div>
                                </div>
                                <div className="hidden md:flex border rounded-xl p-6 text-center bg-gray-50 flex-col justify-center">
                                    <div className="text-sm text-gray-500 mb-2">Ara Geçiş</div>
                                    <div className="font-bold mb-1">Medine - Mekke</div>
                                    <div className="text-xs text-gray-400">Hızlı Tren Transferi</div>
                                </div>
                                <div className="border rounded-xl p-3 md:p-6 text-center">
                                    <PlaneLanding className="mx-auto mb-2 text-emerald-600" size={24} />
                                    <div className="text-[10px] text-gray-500 mb-0.5">Dönüş</div>
                                    <div className="font-bold text-sm md:text-lg mb-0.5" suppressHydrationWarning>{returnDate ? returnDate.full : 'Tarih Sorunuz'}</div>
                                    <div className="text-[10px] text-gray-500">Cidde - İstanbul</div>
                                </div>
                            </div>

                            {/* Pricing Section */}
                            <div className="mb-4 md:mb-8">
                                <h4 className="flex items-center gap-2 font-bold text-base md:text-lg mb-3 md:mb-4 text-gray-800">
                                    <Tag size={18} className="text-emerald-600" />
                                    Ücretler
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
                                    {(tour.pricing ? [
                                        { label: 'Single Oda', price: tour.pricing.single ? `${tour.pricing.single} ${tour.currency}` : 'Sorunuz', note: '*kişi başı' },
                                        { label: 'İkili Oda', price: tour.pricing.double ? `${tour.pricing.double} ${tour.currency}` : 'Sorunuz', note: '*kişi başı' },
                                        { label: 'Üçlü Oda', price: tour.pricing.triple ? `${tour.pricing.triple} ${tour.currency}` : 'Sorunuz', note: '*kişi başı' },
                                        { label: '0-2 Yaş', price: tour.pricing.child_0_2 ? `${tour.pricing.child_0_2} ${tour.currency}` : 'Sorunuz', note: '*yataksız' },
                                        { label: '3-6 Yaş', price: tour.pricing.child_3_6 ? `${tour.pricing.child_3_6} ${tour.currency}` : 'Sorunuz', note: '*yataksız' }
                                    ] : []).map((price, i) => (
                                        <div key={i} className="border rounded-xl p-2.5 md:p-4 text-center hover:border-emerald-500 transition-colors cursor-default bg-gray-50 md:bg-white">
                                            <div className="text-[10px] text-gray-500 mb-1">{price.label}</div>
                                            <div className="font-bold text-emerald-600 text-sm md:text-lg">{price.price}</div>
                                            <div className="text-[8px] text-gray-400 mt-0.5">{price.note}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                             <div>
                                <h4 className="flex items-center gap-2 font-bold text-base md:text-lg mb-3 md:mb-4 text-gray-800">
                                    <Hotel size={18} className="text-emerald-600" />
                                    Konaklama
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                                    <div className="flex gap-3 md:gap-4 p-2 md:p-4 border rounded-xl">
                                        <img src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=150&h=150" className="w-16 h-16 md:w-24 md:h-24 rounded-lg object-cover" alt="Medine" />
                                        <div className="min-w-0">
                                            <div className="font-bold text-sm md:text-base mb-0.5 truncate">Medine Oteli</div>
                                            <div className="text-[10px] md:text-sm text-gray-600 mb-1 truncate">3 Gece • Biltmore (Eski Oberoi)</div>
                                            <div className="text-yellow-400 text-xs md:text-sm">★★★★★</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 md:gap-4 p-2 md:p-4 border rounded-xl">
                                        <img src="https://images.unsplash.com/photo-1565552629477-e254f39b1a08?auto=format&fit=crop&q=80&w=150&h=150" className="w-16 h-16 md:w-24 md:h-24 rounded-lg object-cover" alt="Mekke" />
                                        <div className="min-w-0">
                                            <div className="font-bold text-sm md:text-base mb-0.5 truncate">Mekke Oteli</div>
                                            <div className="text-[10px] md:text-sm text-gray-600 mb-1 truncate">{tour.durationDays - 3} Gece • Raffles Suites</div>
                                            <div className="text-yellow-400 text-xs md:text-sm">★★★★★</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-4 md:px-8 py-3 md:py-4 border-t flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full md:w-auto px-6 py-2 border rounded-lg bg-white hover:bg-gray-100 text-gray-700 font-bold transition-colors shadow-sm"
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
