"use client";

import { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/utils/image-url';

export default function TourItinerary({ itinerary }: { itinerary: any[] }) {
    const [isOpen, setIsOpen] = useState(true);

    if (!itinerary || itinerary.length === 0) return null;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors text-left"
            >
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-gray-900">
                    <Calendar className="text-primary-600" /> Tur Programı
                </h2>
                <div className={`p-2 rounded-full bg-gray-100 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} />
                </div>
            </button>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-4 md:p-8">
                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                        {itinerary.map((item: any, idx: number) => (
                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-primary-500 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold z-10">
                                    {item.day}
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between space-x-2 mb-2">
                                        <div className="font-bold text-slate-900">{item.title}</div>
                                        {item.location && <div className="text-xs font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-1 rounded">{item.location.name}</div>}
                                    </div>
                                    <div className="text-slate-500 text-sm leading-relaxed">{item.description}</div>
                                    {item.hotel && (
                                        <div className="mt-3 flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            {item.hotel.imageUrl && (
                                                <div className="w-12 h-12 shrink-0 rounded-md overflow-hidden relative">
                                                    <Image
                                                        src={getImageUrl(item.hotel.imageUrl)}
                                                        alt={item.hotel.title}
                                                        fill
                                                        sizes="48px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Konaklama</div>
                                                <div className="text-sm font-bold text-gray-700">{item.hotel.title}</div>
                                                {item.hotel.stars && (
                                                    <div className="flex text-yellow-400 text-[10px] mt-0.5">
                                                        {[...Array(item.hotel.stars)].map((_, i) => <span key={i}>★</span>)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
