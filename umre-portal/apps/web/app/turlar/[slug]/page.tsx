
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Calendar, MapPin, Plane, Clock, Info, CheckCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import CommentSection from '@/components/global/CommentSection';
import TourBookingWidget from '@/components/tours/TourBookingWidget';
import TourGallerySlider from '@/components/tours/TourGallerySlider';
import { getImageUrl } from '@/utils/image-url';

async function getTour(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/tours/${slug}`, {
            next: { revalidate: 60 }
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (err) {
        console.error(err);
    }
    return null;
}

async function getLocations() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/locations`, { next: { revalidate: 3600 } });
        if (res.ok) return await res.json();
    } catch (err) {
        console.error(err);
    }
    return [];
}

async function getSiteSettings() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/site-settings`, { next: { revalidate: 3600 } });
        if (res.ok) return await res.json();
    } catch (err) {
        console.error(err);
    }
    return {};
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const tour = await getTour(params.slug);
    if (!tour) return {};

    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kasriroyal.com').replace(/\/$/, '');
    const description = `${tour.title} - ${tour.durationDays} günlük umre turu. ${tour.departureLocation ? `${tour.departureLocation} hareket.` : ''} Fiyat için detayları inceleyin.`;

    const imageUrl = tour.gallery?.[0]
        ? (tour.gallery[0].startsWith('http') ? tour.gallery[0] : `${process.env.NEXT_PUBLIC_API_URL || ''}${tour.gallery[0]}`)
        : `${baseUrl}/logo.png`;

    return {
        title: tour.title,
        description,
        openGraph: {
            title: tour.title,
            description,
            url: `${baseUrl}/turlar/${params.slug}`,
            images: [{ url: imageUrl, alt: tour.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: tour.title,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: `${baseUrl}/turlar/${params.slug}`,
        },
    };
}

export default async function TourDetailPage({ params }: { params: { slug: string } }) {
    const [tour, locations, siteSettings] = await Promise.all([
        getTour(params.slug),
        getLocations(),
        getSiteSettings()
    ]);

    if (!tour) {
        notFound();
    }

    const locationMap = locations.reduce((acc: any, loc: any) => {
        acc[loc.id] = loc.name;
        return acc;
    }, {});


    // Safe URL resolver

    // Date formatting
    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        const d = new Date(dateString);
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const startDate = formatDate(tour.startDate);
    const endDate = formatDate(tour.endDate);
    const returnDate = formatDate(tour.returnDate);

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] bg-gray-900 border-b-222">
                {tour.gallery && tour.gallery.length > 0 ? (
                    <Image
                        src={getImageUrl(tour.gallery[0]) || '/images/placeholder-tour.jpg'}
                        alt={tour.title}
                        fill
                        sizes="100vw"
                        className="object-cover opacity-60"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-90" />
                )}
                <div className="absolute inset-0 flex flex-col justify-end container mx-auto px-4 pb-12 text-white">
                    {tour.label && (
                        <span className="bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold w-max mb-4">
                            {tour.label}
                        </span>
                    )}
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-md">{tour.title}</h1>
                    {tour.shortDescription && (
                        <p className="text-lg md:text-xl text-gray-100/90 mb-6 font-medium max-w-3xl leading-relaxed">
                            {tour.shortDescription}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-6 text-xl md:text-2xl text-gray-200">
                        {startDate && (
                            <div className="flex items-center gap-2" suppressHydrationWarning>
                                <Calendar size={24} className="text-yellow-400" />
                                <span>{startDate} {endDate ? `- ${endDate}` : ''}</span>
                            </div>
                        )}
                        {!startDate && tour.durationDays && <span>{tour.durationDays} Gün - {tour.durationNights} Gece</span>}
                    </div>

                    {/* Mobile CTA Button - Only visible on small screens */}
                    <div className="md:hidden mt-6">
                        <TourBookingWidget tourId={tour.id} tourTitle={tour.title} />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6 relative z-10">
                        {tour.summary && (
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
                                <p className="text-gray-700 leading-relaxed italic text-lg">
                                    "{tour.summary}"
                                </p>
                            </div>
                        )}

                        {/* Info Cards */}
                        <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                            {/* Card 1: Süre */}
                            <div className="text-center p-4 border rounded-lg bg-gray-50 flex flex-col justify-between min-h-[140px]">
                                <div>
                                    <Clock className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                                    <div className="text-[10px] text-gray-500 uppercase font-black tracking-tighter mb-1">Toplam Süre</div>
                                    <div className="font-black text-gray-900 text-sm md:text-base leading-tight">
                                        {tour.durationDays} Gün
                                        <span className="block text-[10px] text-gray-400 font-bold">{tour.durationNights} Gece</span>
                                    </div>
                                </div>
                                <div className="mt-auto pt-2 border-t border-gray-200/50 text-[9px] font-black text-primary-600 uppercase tracking-tighter">
                                    {startDate && endDate ? `${startDate} - ${endDate}` : 'Tarih Sorunuz'}
                                </div>
                            </div>

                            {/* Card 2: Hava Yolu */}
                            <div className="text-center p-4 border rounded-lg bg-gray-50 flex flex-col justify-between min-h-[140px]">
                                <div>
                                    <Plane className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                                    <div className="text-[10px] text-gray-500 uppercase font-black tracking-tighter mb-1">Hava Yolu</div>
                                    <div className="flex flex-wrap justify-center gap-1 mb-1">
                                        {tour.airlines && tour.airlines.length > 0 ? (
                                            tour.airlines.map((airline: any) => (
                                                <div key={airline.id} className="flex flex-col items-center">
                                                    {airline.logoUrl && <img src={getImageUrl(airline.logoUrl)} className="h-4 md:h-6 object-contain mb-1" alt={airline.name} />}
                                                    <div className="font-black text-gray-900 text-[10px] md:text-xs leading-tight">{airline.name}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="font-black text-gray-900 text-sm md:text-base">{tour.airline || 'Havayolu'}</div>
                                        )}
                                    </div>
                                    <div className="text-[9px] text-gray-400 font-bold uppercase">Ulaşım Paketi</div>
                                </div>
                                <div className="mt-auto pt-2 border-t border-gray-200/50 text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                                    Paket Dahil
                                </div>
                            </div>

                            {/* Card 3: Hareket (Gidiş) */}
                            <div className="text-center p-4 border rounded-lg bg-gray-50 flex flex-col justify-between min-h-[140px]">
                                <div>
                                    <MapPin className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                                    <div className="text-[10px] text-gray-500 uppercase font-black tracking-tighter mb-1">Gidiş Rota</div>
                                    <div className="font-black text-gray-900 text-sm md:text-base leading-tight">
                                        {tour.departureLocation || '-'}
                                        {tour.arrivalLocation && (
                                            <span className="flex items-center justify-center gap-1 text-[11px] text-primary-600 mt-0.5">
                                                <ArrowRight size={10} /> {tour.arrivalLocation}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-auto pt-2 border-t border-gray-200/50 text-[9px] font-black text-primary-600 uppercase tracking-tighter">
                                    {startDate || 'Tarih Sorunuz'}
                                </div>
                            </div>

                            {/* Card 4: Uçuş Dönüş */}
                            <div className="text-center p-4 border rounded-lg bg-gray-50 flex flex-col justify-between min-h-[140px]">
                                <div>
                                    <ArrowRight className="w-6 h-6 mx-auto mb-2 text-primary-600 rotate-180 md:rotate-0" />
                                    <div className="text-[10px] text-gray-500 uppercase font-black tracking-tighter mb-1">Dönüş Rota</div>
                                    <div className="font-black text-gray-900 text-sm md:text-base leading-tight">
                                        {tour.returnLocation || '-'}
                                        {tour.returnArrivalLocation && (
                                            <span className="flex items-center justify-center gap-1 text-[11px] text-primary-600 mt-0.5">
                                                <ArrowRight size={10} /> {tour.returnArrivalLocation}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-auto pt-2 border-t border-gray-200/50 text-[9px] font-black text-primary-600 uppercase tracking-tighter">
                                    {returnDate || 'Tarih Sorunuz'}
                                </div>
                            </div>

                            {/* Card 5: Tur Sonu */}
                            <div className="text-center p-4 border rounded-lg bg-gray-50 flex flex-col justify-between min-h-[140px]">
                                <div>
                                    <Calendar className="w-6 h-6 mx-auto mb-2 text-red-600" />
                                    <div className="text-[10px] text-gray-500 uppercase font-black tracking-tighter mb-1">Tur Sonu</div>
                                    <div className="font-black text-gray-900 text-sm md:text-base">Final</div>
                                    <div className="text-[9px] text-gray-400 font-bold uppercase">Varış & Bitiş</div>
                                </div>
                                <div className="mt-auto pt-2 border-t border-gray-200/50 text-[9px] font-black text-red-600 uppercase tracking-tighter">
                                    {endDate || 'Tarih Sorunuz'}
                                </div>
                            </div>
                        </div>

                        {/* Image Slider */}
                        {tour.gallery && tour.gallery.length > 0 && (
                            <TourGallerySlider 
                                images={tour.gallery} 
                            />
                        )}

                        {/* Location Stays Breakdown */}
                        {tour.locationStays && Array.isArray(tour.locationStays) && tour.locationStays.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <MapPin className="text-primary-600" /> Konaklama Bilgileri
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {tour.locationStays
                                        .filter((stay: any) => stay.locationId && locationMap[stay.locationId])
                                        .map((stay: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                    {stay.nights}
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500 uppercase font-semibold">Gece</div>
                                                    <div className="font-bold text-gray-900">{locationMap[stay.locationId]}</div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Itinerary */}
                        {tour.itinerary && tour.itinerary.length > 0 && (
                            <TourItinerary itinerary={tour.itinerary} />
                        )}

                        {/* Details/Content */}
                        {tour.content && (
                            <CollapsibleSection
                                title={<h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-gray-900">Tur Detayları</h2>}
                                defaultOpen={true}
                            >
                                <div
                                    className="prose max-w-none prose-blue"
                                    dangerouslySetInnerHTML={{ __html: tour.content }}
                                />
                            </CollapsibleSection>
                        )}

                        {/* Included Services */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CollapsibleSection
                                title={<h3 className="font-bold text-blue-900 flex items-center gap-2">
                                    <CheckCircle size={20} className="text-blue-600" /> Dahil Hizmetler
                                </h3>}
                                defaultOpen={false}
                                className="bg-blue-50 rounded-xl border border-blue-100 overflow-hidden"
                                contentClassName="p-6 bg-white/50"
                            >
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2"><CheckCircle size={16} className="mt-1 shrink-0 text-blue-500" /> Uçak Bileti</li>
                                    <li className="flex items-start gap-2"><CheckCircle size={16} className="mt-1 shrink-0 text-blue-500" /> Vize İşlemleri</li>
                                    <li className="flex items-start gap-2"><CheckCircle size={16} className="mt-1 shrink-0 text-blue-500" /> Konaklama</li>
                                    <li className="flex items-start gap-2"><CheckCircle size={16} className="mt-1 shrink-0 text-blue-500" /> Transferler</li>
                                    <li className="flex items-start gap-2"><CheckCircle size={16} className="mt-1 shrink-0 text-blue-500" /> Rehberlik Hizmeti</li>
                                    {/* Add dynamic included items if available in schema */}
                                </ul>
                            </CollapsibleSection>

                            {/* Excluded Services */}
                            {tour.excludedText && (
                                <CollapsibleSection
                                    title={<h3 className="font-bold text-red-900 flex items-center gap-2">
                                        <Info size={20} className="text-red-600" /> Fiyata Dahil Olmayanlar
                                    </h3>}
                                    defaultOpen={false}
                                    className="bg-red-50 rounded-xl border border-red-100 overflow-hidden"
                                    contentClassName="p-6 bg-white/50"
                                >
                                    <div
                                        className="prose prose-sm prose-red max-w-none text-red-800"
                                        dangerouslySetInnerHTML={{ __html: tour.excludedText }}
                                    />
                                </CollapsibleSection>
                            )}
                        </div>

                        {/* Global Warning */}
                        {siteSettings.tourImportantNotes && (
                            <CollapsibleSection
                                title={<h3 className="text-red-700 font-bold flex items-center gap-2">
                                    <Info className="animate-pulse" /> Önemli Bilgilendirme
                                </h3>}
                                defaultOpen={false}
                                className="bg-white border-l-4 border-red-500 rounded-r-xl shadow-md overflow-hidden"
                            >
                                <div
                                    className="prose prose-sm prose-red max-w-none text-red-800"
                                    dangerouslySetInnerHTML={{ __html: siteSettings.tourImportantNotes }}
                                />
                            </CollapsibleSection>
                        )}

                        {/* Comments Section */}
                        <div className="mt-8">
                            <CommentSection type="Tour" entityId={tour.id} entityName={tour.title} />
                        </div>
                    </div>

                    {/* Sidebar / Pricing - Sticky & Compact */}
                    <div className="lg:col-span-1 relative z-20">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-xl shadow-xl p-5 border border-gray-100">
                                <div className="text-center mb-4 pb-4 border-b border-gray-100">
                                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Başlangıç Fiyatı</div>
                                    <div className="text-3xl font-bold text-primary-600 flex items-center justify-center gap-1">
                                        {tour.priceFrom} <span className="text-lg text-gray-500 font-medium">{tour.currency}</span>
                                    </div>
                                    <div className="text-xs text-gray-400">Kişi başı</div>
                                </div>

                                {tour.pricing && (
                                    <div className="space-y-2 mb-6">
                                        {tour.pricing.double && (
                                            <div className="flex justify-between items-center text-sm p-2 rounded hover:bg-gray-50 transition-colors">
                                                <span className="text-gray-600">2 Kişilik Oda</span>
                                                <span className="font-bold text-gray-900">{tour.pricing.double} {tour.currency}</span>
                                            </div>
                                        )}
                                        {tour.pricing.triple && (
                                            <div className="flex justify-between items-center text-sm p-2 rounded hover:bg-gray-50 transition-colors">
                                                <span className="text-gray-600">3 Kişilik Oda</span>
                                                <span className="font-bold text-gray-900">{tour.pricing.triple} {tour.currency}</span>
                                            </div>
                                        )}
                                        {tour.pricing.quad && (
                                            <div className="flex justify-between items-center text-sm p-2 rounded hover:bg-gray-50 transition-colors">
                                                <span className="text-gray-600">4 Kişilik Oda</span>
                                                <span className="font-bold text-gray-900">{tour.pricing.quad} {tour.currency}</span>
                                            </div>
                                        )}

                                        {(tour.pricing.child_0_2 || tour.pricing.child_3_6 || tour.pricing.child_7_11) && (
                                            <div className="border-t border-dashed my-2"></div>
                                        )}

                                        {tour.pricing.child_0_2 && (
                                            <div className="flex justify-between items-center text-xs text-gray-500 p-1">
                                                <span>0-2 Yaş</span>
                                                <span className="font-semibold">{tour.pricing.child_0_2} {tour.currency}</span>
                                            </div>
                                        )}
                                        {tour.pricing.child_3_6 && (
                                            <div className="flex justify-between items-center text-xs text-gray-500 p-1">
                                                <span>3-6 Yaş</span>
                                                <span className="font-semibold">{tour.pricing.child_3_6} {tour.currency}</span>
                                            </div>
                                        )}
                                        {tour.pricing.child_7_11 && (
                                            <div className="flex justify-between items-center text-xs text-gray-500 p-1">
                                                <span>7-11 Yaş</span>
                                                <span className="font-semibold">{tour.pricing.child_7_11} {tour.currency}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <TourBookingWidget tourId={tour.id} tourTitle={tour.title} />

                                <p className="text-[10px] text-center text-gray-400 mt-4">
                                    * Fiyatlar kişi başıdır ve kontenjan durumuna göre değişiklik gösterebilir.
                                </p>
                            </div>

                            {/* Need explicit height to ensure sticky works correctly if sidebar is shorter than content */}
                            <div className="hidden lg:block h-screen pointer-events-none opacity-0">Spacer</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import CollapsibleSection from '@/components/ui/CollapsibleSection';
import TourItinerary from '@/components/tours/TourItinerary';

