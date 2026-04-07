import Link from 'next/link';
import { getImageUrl } from '@/utils/image-url';

async function getLocations() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/locations`, {
            next: { revalidate: 3600 }
        });
        if (res.ok) return await res.json();
    } catch (err) {
        console.error(err);
    }
    return [];
}

async function getHotels(locationId?: string) {
    try {
        const url = locationId 
            ? `${process.env.NEXT_PUBLIC_API_URL || ''}/api/hotels?locationId=${locationId}`
            : `${process.env.NEXT_PUBLIC_API_URL || ''}/api/hotels`;
            
        const res = await fetch(url, {
            next: { revalidate: 3600 }
        });
        if (res.ok) return await res.json();
    } catch (err) {
        console.error(err);
    }
    return [];
}

export default async function HotelsPage({ searchParams }: { searchParams: { location?: string } }) {
    const locations = await getLocations();
    const activeLocation = searchParams.location || (locations.length > 0 ? locations[0].id : '');
    const hotels = await getHotels(activeLocation);

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 uppercase">Anlaşmalı Otellerimiz</h1>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                Konforunuz ve huzurunuz için özenle seçtiğimiz, kutsal mekanlara yakınlığı ve hizmet kalitesiyle öne çıkan anlaşmalı otellerimiz.
            </p>

            {/* Dynamic Tabs via Links */}
            <div className="flex justify-center gap-3 mb-16 flex-wrap">
                {locations.map((loc: any) => (
                    <Link
                        key={loc.id}
                        href={`/oteller?location=${loc.id}`}
                        scroll={false}
                        className={`px-8 py-3 rounded-full font-bold transition-all duration-300 shadow-sm hover:shadow-md border-2 ${activeLocation === loc.id
                                ? 'bg-primary-600 border-primary-600 text-white scale-105'
                                : 'bg-white border-gray-100 text-gray-700 hover:border-primary-200 hover:bg-gray-50'
                            }`}
                    >
                        {loc.name}
                    </Link>
                ))}
            </div>

            {hotels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {hotels.map((hotel: any) => (
                        <div key={hotel.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col group h-[500px] border border-gray-100">
                            <div className="h-64 bg-gray-200 relative overflow-hidden">
                                <img
                                    src={hotel.imageUrl ? getImageUrl(hotel.imageUrl) : (hotel.gallery && hotel.gallery[0]) ? getImageUrl(hotel.gallery[0]) : '/placeholder-hotel.jpg'}
                                    alt={hotel.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {hotel.isFeatured && (
                                    <span className="absolute top-4 left-4 bg-yellow-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg z-10 uppercase tracking-wider italic">Öne Çıkan</span>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-2xl text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">{hotel.title}</h3>
                                    {hotel.stars && (
                                        <div className="text-yellow-400 flex text-sm">
                                            {'★'.repeat(hotel.stars)}
                                        </div>
                                    )}
                                </div>
                                <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                    </div>
                                    <span className="truncate font-medium">{hotel.locationText || locations.find((l: any) => l.id === activeLocation)?.name}</span>
                                </div>

                                <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                                    {hotel.shortDescription || "Otel hakkında kısa bilgi bulunmamaktadır."}
                                </p>

                                <Link
                                    href={`/oteller/${hotel.slug}`}
                                    className="block w-full text-center bg-gray-900 text-white py-4 rounded-xl hover:bg-primary-600 transition-all mt-auto font-bold shadow-lg shadow-gray-200 hover:shadow-primary-200 hover:-translate-y-1"
                                >
                                    Detayları İncele
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 text-gray-500 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-xl font-medium">Bu lokasyonda henüz listelenen otel bulunmamaktadır.</p>
                    <button className="mt-4 text-primary-600 font-bold hover:underline">Diğer bölgelere göz atın</button>
                </div>
            )}
        </div>
    );
}
