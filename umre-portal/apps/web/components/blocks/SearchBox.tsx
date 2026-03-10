"use client";
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SearchBox() {
    const router = useRouter();
    const [date, setDate] = useState('');
    const [days, setDays] = useState('');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (date) params.set('date', date);
        if (days) params.set('days', days);
        router.push(`/turlar?${params.toString()}`);
    };

    const containerClasses = `bg-white rounded-xl shadow-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 items-end transition-all duration-500`;
    const glassClasses = `bg-white/60 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row gap-4 items-end transition-all duration-500 hover:bg-white/80`;

    return (
        <div className="container mx-auto -mt-16 md:-mt-32 relative z-30 px-4 mb-12 max-w-5xl">
            <div className={scrolled ? containerClasses : glassClasses}>
                <div className="flex-1 w-full">
                    <label className="block text-sm font-bold text-gray-800 mb-1">Gidiş Tarihi</label>
                    <input
                        type="date"
                        className="w-full border border-gray-200/50 bg-white/80 rounded-lg p-3 font-medium focus:ring-2 focus:ring-primary-500 outline-none backdrop-blur-sm"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-sm font-bold text-gray-800 mb-1">Gün Sayısı</label>
                    <select
                        className="w-full border border-gray-200/50 bg-white/80 rounded-lg p-3 font-medium focus:ring-2 focus:ring-primary-500 outline-none backdrop-blur-sm"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                    >
                        <option value="">Seçiniz</option>
                        <option value="7">7 Gün</option>
                        <option value="10">10 Gün</option>
                        <option value="14">14 Gün</option>
                        <option value="21">21 Gün</option>
                    </select>
                </div>
                <button
                    onClick={handleSearch}
                    className="w-full md:w-auto bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-900 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary-600/30"
                >
                    <Search size={20} />
                    Ara
                </button>
            </div>
        </div>
    );
}
