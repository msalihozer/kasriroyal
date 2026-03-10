"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Filter, X } from 'lucide-react';

interface TourFiltersProps {
    searchParams: { [key: string]: string | string[] | undefined };
    tourTypes: any[];
    months: { value: string; label: string }[];
}

export default function TourFilters({ searchParams, tourTypes, months }: TourFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Determines if any filter is active
    const hasActiveFilters = !!(searchParams.type || searchParams.minPrice || searchParams.maxPrice || searchParams.month);

    return (
        <>
            {/* Mobile Filter Toggle Button */}
            {/* Mobile Filter Toggle Button */}
            <div className="md:hidden mb-4 flex justify-start">
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-white border border-gray-200 py-2 px-4 rounded-lg flex items-center gap-3 shadow-sm hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-600" />
                        <span className="font-medium text-gray-700 text-sm">Filtrele ve Sırala</span>
                    </div>
                    {hasActiveFilters && (
                        <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Aktif</span>
                    )}
                </button>
            </div>

            {/* Filter Sidebar / Modal */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 bg-white md:static md:z-auto md:bg-transparent md:block
                transition-transform duration-300 w-[80%] md:w-64 flex-shrink-0 shadow-2xl md:shadow-none
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Mobile Header */}
                <div className="md:hidden p-4 border-b flex items-center justify-between bg-gray-50">
                    <h2 className="font-bold text-lg">Filtreler</h2>
                    <button onClick={() => setIsOpen(false)} className="p-2 bg-white rounded-full border">
                        <X size={20} />
                    </button>
                </div>

                <div className="h-full overflow-y-auto md:h-auto md:overflow-visible p-6 md:p-6 md:bg-white md:rounded-xl md:shadow-sm md:sticky md:top-24">
                    <div className="hidden md:block">
                        <h2 className="font-bold text-lg mb-4 pb-2 border-b">Filtrele</h2>
                    </div>

                    <form className="space-y-6">
                        {/* Tour Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tur Tipi</label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value=""
                                        defaultChecked={!searchParams.type}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm">Tümü</span>
                                </label>
                                {tourTypes.map((type: any) => (
                                    <label key={type.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded -ml-1">
                                        <input
                                            type="radio"
                                            name="type"
                                            value={type.slug}
                                            defaultChecked={searchParams.type === type.slug}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm">{type.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat Aralığı</label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    name="minPrice"
                                    placeholder="Min"
                                    defaultValue={searchParams.minPrice as string}
                                    className="w-full border rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                                <input
                                    type="number"
                                    name="maxPrice"
                                    placeholder="Max"
                                    defaultValue={searchParams.maxPrice as string}
                                    className="w-full border rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Month Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ay Seçimi</label>
                            <select
                                name="month"
                                className="w-full border rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                                defaultValue={searchParams.month as string}
                            >
                                <option value="">Tümü</option>
                                {months.map(m => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-4 border-t md:border-none">
                            <button type="submit" className="w-full bg-blue-600 text-white py-3 md:py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
                                Uygula
                            </button>

                            {hasActiveFilters && (
                                <Link href="/turlar" className="block text-center text-xs text-gray-500 mt-3 hover:underline">
                                    Filtreleri Temizle
                                </Link>
                            )}
                        </div>
                    </form>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
