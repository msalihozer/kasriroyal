
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Calendar, MapPin, Plane, Clock, Info, CheckCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import CommentSection from '@/components/global/CommentSection';
import TourBookingWidget from '@/components/tours/TourBookingWidget';

async function getTour(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/tours/${slug}`, {
            next: { revalidate: 3600 }
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
    const getFullUrl = (url?: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${process.env.NEXT_PUBLIC_API_URL || ''}${url}`;
    };

    // Date formatting
    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        const d = new Date(dateString);
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const startDate = formatDate(tour.startDate);
    const endDate = formatDate(tour.endDate);

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] bg-gray-900 border-b-222">
                {tour.gallery && tour.gallery.length > 0 ? (
                    <Image
                        src={getFullUrl(tour.gallery[0]) || '/images/placeholder-tour.jpg'}
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
                    <div className="flex flex-wrap gap-6 text-xl md:text-2xl text-gray-200">
                        {startDate && (
                            <div className="flex items-center gap-2" suppressHydrationWarning>
                                <Calendar size={24} className="text-yellow-400" />
                                <span>{startDate} {endDate ? `- ${endDate}` : ''}</span>
                            </div>
                        )}
                        {!startDate && tour.durationDays && <span>{tour.durationDays} Gün - {tour.durationNights} Gece</span>}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Info Cards */}
                        <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 border rounded-lg bg-gray-50">
                                <Clock className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                                <div className="text-sm text-gray-500">Süre</div>
                                <div className="font-bold">{tour.durationDays} Gün</div>
                                <div className="text-xs text-gray-400">{tour.durationNights} Gece</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg bg-gray-50">
                                <Plane className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                                <div className="text-sm text-gray-500">Uçuş</div>
                                <div className="font-bold">{tour.airline || 'Belirtilmedi'}</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg bg-gray-50">
                                <MapPin className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                                <div className="text-sm text-gray-500">Kalkış</div>
                                <div className="font-bold">{tour.departureLocation || '-'}</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg bg-gray-50">
                                <ArrowRight className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                                <div className="text-sm text-gray-500">Dönüş</div>
                                <div className="font-bold">{tour.returnLocation || '-'}</div>
                            </div>
                        </div>

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
                    <div className="lg:col-span-1">
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

