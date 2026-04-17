import { ChevronLeft, Check, MapPin, Globe, Star } from 'lucide-react';
import CommentSection from '@/components/global/CommentSection';
import HotelGallery from '@/components/hotels/HotelGallery';
import CollapsibleSection from '@/components/ui/CollapsibleSection';
import { notFound } from 'next/navigation';
import Link from 'next/link';

async function getHotel(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/hotels/${slug}`, {
            next: { revalidate: 3600 }
        });
        if (res.ok) return await res.json();
    } catch (err) {
        console.error(err);
    }
    return null;
}

export default async function HotelDetailPage({ params }: { params: { slug: string } }) {
    const hotel = await getHotel(params.slug);

    if (!hotel) {
        notFound();
    }

    const images = [hotel.imageUrl, ...(hotel.gallery || [])].filter(Boolean);
    if (images.length === 0) images.push('/placeholder-hotel.jpg');

    const groupedFeatures = hotel?.features?.reduce((acc: any, feature: any) => {
        const cat = feature.category || 'Diğer Özellikler';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(feature);
        return acc;
    }, {}) || {};

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <Link href="/oteller" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary-600 mb-8 transition-all hover:-translate-x-1">
                <ChevronLeft size={20} />
                TÜM OTELLERE DÖN
            </Link>

            {/* Header: Title and Location */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                    {hotel.stars && (
                        <div className="flex text-yellow-400 drop-shadow-sm">
                            {'★'.repeat(hotel.stars)}
                        </div>
                    )}
                    <span className="text-gray-300">|</span>
                    <span className="text-primary-600 font-black tracking-widest uppercase text-sm">{hotel.location?.name || 'Konum Belirtilmedi'}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight">{hotel.title}</h1>
                {hotel.locationText && (
                    <div className="inline-flex items-center gap-3 bg-gray-50 px-6 py-2.5 rounded-full border border-gray-100 shadow-sm">
                        <MapPin size={20} className="text-primary-600" />
                        <span className="text-gray-700 font-medium">{hotel.locationText}</span>
                    </div>
                )}
            </div>

            {/* Slider / Gallery component */}
            <HotelGallery 
                images={images} 
                title={hotel.title} 
                apiBaseUrl={process.env.NEXT_PUBLIC_API_URL || ''} 
            />

            {/* Details and Features */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
                <div className="lg:col-span-2 space-y-12">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                        <h2 className="text-2xl font-black text-gray-900 mb-8 border-b border-gray-100 pb-4 uppercase tracking-wider">Otel Hakkında</h2>
                        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: hotel.description || '' }} />
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
                        <h3 className="font-black text-2xl md:text-3xl mb-10 text-gray-900 border-b border-gray-100 pb-6 uppercase tracking-widest">Sunduğumuz İmkanlar</h3>
                        {Object.keys(groupedFeatures).length > 0 ? (
                            <div className="space-y-6">
                                {Object.entries(groupedFeatures).map(([category, features]: any) => (
                                    <CollapsibleSection
                                        key={category}
                                        defaultOpen={false}
                                        className="bg-gray-50/50 rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-100 transition-all"
                                        contentClassName="p-8 pt-2"
                                        title={
                                            <div className="flex items-center gap-4">
                                                <div className="w-1.5 h-6 bg-primary-600 rounded-full" />
                                                <h4 className="font-bold text-lg text-gray-900 uppercase tracking-widest">{category}</h4>
                                            </div>
                                        }
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {features.map((feature: any) => (
                                                <div key={feature.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm group hover:border-primary-200 transition-all">
                                                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 text-primary-600 group-hover:scale-110 transition-transform">
                                                        <Check size={16} strokeWidth={3} />
                                                    </div>
                                                    <span className="font-bold text-gray-700 tracking-wide text-sm">{feature.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CollapsibleSection>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">Özellik bilgisi bulunmamaktadır.</p>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    {hotel.websiteUrl && (
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-primary-50 text-center">
                            <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Globe size={32} />
                            </div>
                            <h3 className="font-black text-xl mb-4">Resmi Web Sitesi</h3>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                Otelin resmi web sitesini ziyaret ederek daha detaylı bilgi alabilirsiniz.
                            </p>
                            <a
                                href={hotel.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-3 bg-primary-600 text-white w-full py-5 rounded-2xl font-black hover:bg-primary-700 transition-all hover:scale-[1.03] shadow-lg shadow-primary-200"
                            >
                                SİTEYİ ZİYARET ET
                            </a>
                        </div>
                    )}

                </div>
            </div>

            {/* Map Section - Full Width Below Content */}
            {(hotel.lat && hotel.lng) && (
                <div className="mt-16 bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <h2 className="text-2xl md:text-3xl font-black flex items-center gap-4 uppercase tracking-wider text-gray-900">
                            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-lg shadow-red-50">
                                <MapPin size={28} />
                            </div>
                            KONUM VE ULAŞIM
                        </h2>
                        <div className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                            <Star className="text-yellow-500 fill-yellow-500" size={20} />
                            <span className="font-bold text-gray-700">{hotel.location?.name || 'Konum Belirtilmedi'}</span>
                        </div>
                    </div>
                    
                    <div className="rounded-[2.5rem] overflow-hidden h-[500px] shadow-2xl bg-gray-100 relative border-8 border-gray-50">
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src={`https://maps.google.com/maps?q=${hotel.lat},${hotel.lng}&z=15&output=embed`}
                            className="absolute inset-0 w-full h-full"
                        >
                        </iframe>
                        
                        {/* Overlay detail */}
                        <div className="absolute bottom-8 left-8 right-8 md:right-auto bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/50 max-w-md hidden md:block">
                            <h4 className="font-black text-gray-900 mb-2 uppercase tracking-tight">{hotel.title}</h4>
                            <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
                                <MapPin size={14} className="text-primary-600" />
                                {hotel.locationText}
                            </p>
                            <a 
                                href={`https://www.google.com/maps/dir/?api=1&destination=${hotel.lat},${hotel.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-2 text-primary-600 font-bold text-sm hover:underline"
                            >
                                YOL TARİFİ AL <ChevronLeft className="rotate-180" size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Comments Section */}
            <div className="mt-20 bg-gray-50 rounded-[3rem] p-8 md:p-16 border border-gray-100">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-14 h-14 bg-yellow-400 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-100">
                        <Star size={28} fill="currentColor" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">Misafir Değerlendirmeleri</h2>
                </div>
                <CommentSection type="Hotel" entityId={hotel.id} entityName={hotel.title} />
            </div>
        </div>
    );
}
