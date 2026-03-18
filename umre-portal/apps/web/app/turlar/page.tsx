import Link from 'next/link';
import type { Metadata } from 'next';
import TourRow from '../../components/cards/TourRow';
import TourFilters from '../../components/tours/TourFilters';

export const metadata: Metadata = {
    title: 'Umre Turları',
    description: 'Kasri Royal\'ın özel umre tur paketlerini keşfedin. VIP umre, butik umre ve ekonomik paketler ile Mekke ve Medine\'ye güvenli seyahat.',
    alternates: {
        canonical: 'https://kasriroyal.com/turlar',
    },
};



async function getTours(searchParams: any) {
    const params = new URLSearchParams();
    if (searchParams.type) params.append('type', searchParams.type);
    if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice);
    if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice);
    // Note: Month filtering might need client-side or specific API support if not implemented

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/tours?${params.toString()}`, {
            cache: 'no-store'
        });
        if (res.ok) {
            const data = await res.json();
            return data.data || [];
        }
    } catch (err) {
        console.error(err);
    }
    return [];
}

async function getTourTypes() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/tour-types`, { cache: 'no-store' });
        if (res.ok) return await res.json();
    } catch (err) {
        console.error(err);
    }
    return [];
}

async function getLocations() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/locations`, { cache: 'no-store' });
        if (res.ok) return await res.json();
    } catch (err) {
        console.error(err);
    }
    return [];
}

export default async function ToursPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const [tours, tourTypes, locations] = await Promise.all([
        getTours(searchParams),
        getTourTypes(),
        getLocations()
    ]);

    // Create location map for resolving IDs
    const locationMap = locations.reduce((acc: any, loc: any) => {
        acc[loc.id] = { name: loc.name, imageUrl: loc.imageUrl };
        return acc;
    }, {});


    const months = [
        { value: '1', label: 'Ocak' }, { value: '2', label: 'Şubat' }, { value: '3', label: 'Mart' },
        { value: '4', label: 'Nisan' }, { value: '5', label: 'Mayıs' }, { value: '6', label: 'Haziran' },
        { value: '7', label: 'Temmuz' }, { value: '8', label: 'Ağustos' }, { value: '9', label: 'Eylül' },
        { value: '10', label: 'Ekim' }, { value: '11', label: 'Kasım' }, { value: '12', label: 'Aralık' }
    ];

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <TourFilters searchParams={searchParams} tourTypes={tourTypes} months={months} />

                {/* Results */}
                <div className="flex-1">
                    {/* Custom Tour CTA */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 border border-white/10 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden group animate-slide-in-right">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#bda569]/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#bda569]/20 transition-colors duration-500"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-white mb-1">
                                İstediğiniz turu bulamadınız mı?
                            </h3>
                            <p className="text-sm text-gray-300">
                                Size özel umre programı hazırlayalım.
                            </p>
                        </div>
                        <Link
                            href="/kendi-turunu-planla"
                            className="relative z-10 whitespace-nowrap bg-[#bda569] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#a38b55] hover:shadow transition-all flex items-center gap-2 text-sm group/btn"
                        >
                            <span className="group-hover/btn:rotate-12 transition-transform">✨</span>
                            KENDİN PLANLA
                        </Link>
                    </div>

                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Turlar ({tours.length})</h1>
                        <div className="text-sm text-gray-500">
                            {tours.length} tur listeleniyor
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {tours.map((tour: any) => (
                            <TourRow key={tour.id} tour={tour} locationsMap={locationMap} />
                        ))}

                        {tours.length === 0 && (
                            <div className="bg-white p-12 rounded-xl border text-center text-gray-500">
                                Aradığınız kriterlere uygun tur bulunamadı.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
