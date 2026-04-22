"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '../../../../components/ui/ImageUpload';
import GalleryUpload from '../../../../components/ui/GalleryUpload';
import RichTextEditor from '../../../../components/ui/RichTextEditor';
import { Plus, Trash, GripVertical } from 'lucide-react';
import { getImageUrl } from '../../../../utils/image-url';

export default function TourFormPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const isNew = params.id === 'new';

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        summary: '',
        shortDescription: '',
        content: '',
        durationDays: 7,
        durationNights: 0,
        priceFrom: '',
        currency: 'USD',
        isFeatured: false,
        status: 'draft',
        gallery: [] as string[],
        thumbnailUrl: '', // New
        excludedText: '', // Added

        // New Fields
        tourTypeId: '',
        vehicleId: '',
        airline: '',
        departureLocation: '',
        arrivalLocation: '',
        returnLocation: '',
        returnArrivalLocation: '',
        label: '',

        // Date Fields
        startDate: '',
        endDate: '',
        returnDate: '', // Specific return date (flight)

        // Stays
        locationStays: [] as any[], // { locationId, nights }

        // Complex Fields
        pricing: {
            single: '',
            double: '',
            triple: '',
            quad: '',
            child_0_2: '',
            child_3_6: '',
            child_7_11: ''
        },
        airlineIds: [] as string[],
        itinerary: [] as any[] // { day, title, description, locationId, hotelId }
    });

    // Resources
    const [tourTypes, setTourTypes] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [hotels, setHotels] = useState<any[]>([]);
    const [allAirlines, setAllAirlines] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

    useEffect(() => {
        fetchResources();
        if (!isNew) {
            fetchTour();
        }
    }, []);
    
    // Auto-calculate durations based on dates
    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            const diffTime = end.getTime() - start.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            
            if (diffDays > 0) {
                setFormData(prev => ({
                    ...prev,
                    durationDays: diffDays,
                    durationNights: diffDays - 1
                }));
            }
        }
    }, [formData.startDate, formData.endDate]);

    const fetchResources = async () => {
        try {
            const [typesRes, vehiclesRes, locsRes, hotelsRes, allAirlinesRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/tour-types`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/vehicles`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/locations`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/hotels?status=all`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/airlines`)
            ]);

            if (typesRes.ok) setTourTypes(await typesRes.json());
            if (vehiclesRes.ok) setVehicles(await vehiclesRes.json());
            if (locsRes.ok) setLocations(await locsRes.json());
            if (hotelsRes.ok) setHotels(await hotelsRes.json());
            if (allAirlinesRes.ok) setAllAirlines(await allAirlinesRes.json());

        } catch (err) {
            console.error("Resource fetch error:", err);
        }
    };

    const fetchTour = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/tours/${params.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    ...data,
                    startDate: data.startDate ? data.startDate.split('T')[0] : '',
                    endDate: data.endDate ? data.endDate.split('T')[0] : '',
                    returnDate: data.returnDate ? data.returnDate.split('T')[0] : '',
                    arrivalLocation: data.arrivalLocation || '',
                    returnArrivalLocation: data.returnArrivalLocation || '',
                    locationStays: data.locationStays || [],
                    pricing: data.pricing || { single: '', double: '', triple: '', child_0_2: '', child_3_6: '', child_7_11: '' },
                    shortDescription: data.shortDescription || '',
                    itinerary: data.itinerary || [],
                    excludedText: data.excludedText || '', // Added
                    airlineIds: data.airlines ? data.airlines.map((a: any) => a.id) : [],
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handlePricingChange = (key: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            pricing: { ...prev.pricing, [key]: value } // value is string to allow empty
        }));
    };

    // Location Stays Handlers
    const addLocationStay = () => {
        setFormData(prev => ({
            ...prev,
            locationStays: [...prev.locationStays, { locationId: '', nights: 0 }]
        }));
    };

    const updateLocationStay = (index: number, field: string, value: any) => {
        const newStays = [...formData.locationStays];
        newStays[index] = { ...newStays[index], [field]: value };
        setFormData(prev => ({ ...prev, locationStays: newStays }));
    };

    const removeLocationStay = (index: number) => {
        setFormData(prev => ({
            ...prev,
            locationStays: prev.locationStays.filter((_, i) => i !== index)
        }));
    };

    const sanitizeSlug = (text: string) => {
        const trMap: any = {
            'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
            'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
        };
        for (let key in trMap) {
            text = text.replace(new RegExp(key, 'g'), trMap[key]);
        }
        return text
            .toLowerCase()
            .replace(/[^-a-zA-Z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    const addItineraryItem = () => {
        setFormData(prev => ({
            ...prev,
            itinerary: [
                ...prev.itinerary,
                {
                    day: prev.itinerary.length + 1,
                    title: '',
                    description: '',
                    locationId: '',
                    hotelId: ''
                }
            ]
        }));
    };

    const updateItineraryItem = (index: number, field: string, value: any) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[index] = { ...newItinerary[index], [field]: value };
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const removeItineraryItem = (index: number) => {
        const newItinerary = formData.itinerary.filter((_, i) => i !== index);
        // Re-index days? Maybe optionally. For now let's keep it simple.
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const url = isNew
                ? `${process.env.NEXT_PUBLIC_API_URL || ''}/api/tours`
                : `${process.env.NEXT_PUBLIC_API_URL || ''}/api/tours/${params.id}`;

            // Prepare payload with correct types
            const payload = {
                ...formData,
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
                returnDate: formData.returnDate ? new Date(formData.returnDate).toISOString() : null,
                durationDays: Number(formData.durationDays),
                durationNights: Number(formData.durationNights),
                priceFrom: formData.priceFrom === '' ? null : parseFloat(formData.priceFrom),
            };

            const res = await fetch(url, {
                method: isNew ? 'POST' : 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/turlar');
            } else {
                const errorData = await res.json();
                alert(errorData.message || 'Kaydetme başarısız');
            }
        } catch (err) {
            alert('Bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <h1 className="text-3xl font-bold mb-6">{isNew ? 'Yeni Tur' : 'Tur Düzenle'}</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-white rounded-lg shadow p-6 space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Genel Bilgiler</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">Tur Başlığı</label>
                            <input 
                                type="text" 
                                className="w-full border rounded p-2" 
                                value={formData.title} 
                                onChange={e => {
                                    const newTitle = e.target.value;
                                    setFormData(prev => ({ 
                                        ...prev, 
                                        title: newTitle,
                                        slug: isSlugManuallyEdited ? prev.slug : sanitizeSlug(newTitle)
                                    }));
                                }} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Slug (Sadece İngilizce Karakterler)</label>
                            <input 
                                type="text" 
                                className="w-full border rounded p-2 bg-gray-50" 
                                value={formData.slug} 
                                onChange={e => {
                                    setIsSlugManuallyEdited(true);
                                    setFormData({ ...formData, slug: sanitizeSlug(e.target.value) });
                                }} 
                                placeholder="tur-ismi-ingilizce"
                                required 
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Örn: vip-umre-tur-2026</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Etiket (Label)</label>
                            <input type="text" className="w-full border rounded p-2" value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} placeholder="Örn: Sömestr Özel" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tur Tipi</label>
                            <select className="w-full border rounded p-2" value={formData.tourTypeId} onChange={e => setFormData({ ...formData, tourTypeId: e.target.value })}>
                                <option value="">Seçiniz</option>
                                {tourTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Gidilecek Araç / Uçak</label>
                            <select className="w-full border rounded p-2" value={formData.vehicleId} onChange={e => setFormData({ ...formData, vehicleId: e.target.value })}>
                                <option value="">Araç Seçiniz (Opsiyonel)</option>
                                {vehicles.map(v => <option key={v.id} value={v.id}>{v.modelName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Havayolu Şirketi (Eski - Metin)</label>
                            <input type="text" className="w-full border rounded p-2" value={formData.airline || ''} onChange={e => setFormData({ ...formData, airline: e.target.value })} placeholder="THY, Pegasus vb." />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-2">Havayolu Şirketleri (Yeni - Çoklu Seçim)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border rounded-lg p-4 bg-gray-50">
                                {allAirlines.map(airline => (
                                    <label key={airline.id} className="flex items-center gap-2 p-2 bg-white border rounded hover:border-blue-300 cursor-pointer transition-colors">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.airlineIds.includes(airline.id)}
                                            onChange={(e) => {
                                                const ids = e.target.checked 
                                                    ? [...formData.airlineIds, airline.id]
                                                    : formData.airlineIds.filter(id => id !== airline.id);
                                                setFormData({ ...formData, airlineIds: ids });
                                            }}
                                            className="w-4 h-4 rounded text-blue-600"
                                        />
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            {airline.logoUrl && <img src={getImageUrl(airline.logoUrl)} className="h-4 w-6 object-contain shrink-0" alt="" />}
                                            <span className="text-xs font-medium truncate">{airline.name}</span>
                                        </div>
                                    </label>
                                ))}
                                {allAirlines.length === 0 && (
                                    <p className="col-span-full text-center text-gray-400 text-xs py-2">
                                        Henüz havayolu eklenmemiş. Lütfen "Havayolları" menüsünden ekleyin.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logistics */}
                <div className="bg-white rounded-lg shadow p-6 space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Ulaşım ve Süre</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Gidiş Tarihi</label>
                            <input type="date" className="w-full border rounded p-2" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Dönüş Tarihi (Tur Bitiş)</label>
                            <input type="date" className="w-full border rounded p-2" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Uçuş Dönüş Tarihi</label>
                            <input type="date" className="w-full border rounded p-2" value={formData.returnDate} onChange={e => setFormData({ ...formData, returnDate: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Gidiş: Kalkış Yeri</label>
                            <input type="text" className="w-full border rounded p-2" value={formData.departureLocation} onChange={e => setFormData({ ...formData, departureLocation: e.target.value })} placeholder="İstanbul" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Gidiş: Varış Yeri</label>
                            <input type="text" className="w-full border rounded p-2" value={formData.arrivalLocation} onChange={e => setFormData({ ...formData, arrivalLocation: e.target.value })} placeholder="Medine" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Dönüş: Kalkış Yeri</label>
                            <input type="text" className="w-full border rounded p-2" value={formData.returnLocation} onChange={e => setFormData({ ...formData, returnLocation: e.target.value })} placeholder="Cidde" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Dönüş: Varış Yeri</label>
                            <input type="text" className="w-full border rounded p-2" value={formData.returnArrivalLocation} onChange={e => setFormData({ ...formData, returnArrivalLocation: e.target.value })} placeholder="İstanbul" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Gün Sayısı</label>
                            <input type="number" className="w-full border rounded p-2" value={formData.durationDays} onChange={e => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 0 })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Gece Sayısı</label>
                            <input type="number" className="w-full border rounded p-2" value={formData.durationNights} onChange={e => setFormData({ ...formData, durationNights: parseInt(e.target.value) || 0 })} />
                        </div>
                    </div>
                </div>

                {/* Location Stays */}
                <div className="bg-white rounded-lg shadow p-6 space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-xl font-semibold">Konaklama Süreleri</h2>
                        <button type="button" onClick={addLocationStay} className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded hover:bg-blue-100 flex items-center gap-1">
                            <Plus size={16} /> Lokasyon Ekle
                        </button>
                    </div>
                    <div className="space-y-3">
                        {formData.locationStays.map((stay, idx) => (
                            <div key={idx} className="flex gap-4 items-center border p-3 rounded-lg bg-gray-50">
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-500 mb-1">Lokasyon</label>
                                    <select className="w-full border rounded p-2" value={stay.locationId} onChange={e => updateLocationStay(idx, 'locationId', e.target.value)}>
                                        <option value="">Seçiniz</option>
                                        {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                    </select>
                                </div>
                                <div className="w-32">
                                    <label className="block text-xs text-gray-500 mb-1">Gece</label>
                                    <input type="number" className="w-full border rounded p-2" value={stay.nights} onChange={e => updateLocationStay(idx, 'nights', parseInt(e.target.value))} />
                                </div>
                                <button type="button" onClick={() => removeLocationStay(idx)} className="text-red-400 hover:text-red-600 mt-4">
                                    <Trash size={18} />
                                </button>
                            </div>
                        ))}
                        {formData.locationStays.length === 0 && (
                            <div className="text-center py-4 text-gray-400 text-sm">Hangi şehirde kaç gece kalınacağını belirtin.</div>
                        )}
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white rounded-lg shadow p-6 space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Fiyatlandırma</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Para Birimi</label>
                            <select className="w-full border rounded p-2" value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value })}>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="TRY">TRY (₺)</option>
                                <option value="SAR">SAR (﷼)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Başlangıç Fiyatı (Listeleme)</label>
                            <input type="number" className="w-full border rounded p-2" value={formData.priceFrom} onChange={e => setFormData({ ...formData, priceFrom: e.target.value })} />
                        </div>
                        <div className="hidden md:block"></div>

                        {/* Rooms */}
                        <div>
                            <label className="block text-xs uppercase text-gray-500 mb-1">2 Kişilik Oda (Kişi Başı)</label>
                            <input type="number" className="w-full border rounded p-2" value={formData.pricing?.double} onChange={e => handlePricingChange('double', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-gray-500 mb-1">3 Kişilik Oda (Kişi Başı)</label>
                            <input type="number" className="w-full border rounded p-2" value={formData.pricing?.triple} onChange={e => handlePricingChange('triple', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-gray-500 mb-1">4 Kişilik Oda (Kişi Başı)</label>
                            <input type="number" className="w-full border rounded p-2" value={formData.pricing?.quad} onChange={e => handlePricingChange('quad', e.target.value)} />
                        </div>

                        {/* Children */}
                        <div>
                            <label className="block text-xs uppercase text-gray-500 mb-1">0-2 Yaş Bebek</label>
                            <input type="number" className="w-full border rounded p-2" value={formData.pricing?.child_0_2} onChange={e => handlePricingChange('child_0_2', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-gray-500 mb-1">3-6 Yaş Çocuk</label>
                            <input type="number" className="w-full border rounded p-2" value={formData.pricing?.child_3_6} onChange={e => handlePricingChange('child_3_6', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-gray-500 mb-1">7-11 Yaş Çocuk</label>
                            <input type="number" className="w-full border rounded p-2" value={formData.pricing?.child_7_11} onChange={e => handlePricingChange('child_7_11', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Itinerary */}
                <div className="bg-white rounded-lg shadow p-6 space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-xl font-semibold">Tur Programı</h2>
                        <button type="button" onClick={addItineraryItem} className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded hover:bg-green-100 flex items-center gap-1">
                            <Plus size={16} /> Gün Ekle
                        </button>
                    </div>

                    <div className="space-y-4">
                        {formData.itinerary.map((item, idx) => (
                            <div key={idx} className="border rounded-lg p-4 bg-gray-50 relative">
                                <button type="button" onClick={() => removeItineraryItem(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">
                                    <Trash size={18} />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                    <div className="flex gap-2">
                                        <div className="w-20">
                                            <label className="block text-xs text-gray-500 mb-1">Gün</label>
                                            <input type="number" className="w-full border rounded p-2" value={item.day} onChange={e => updateItineraryItem(idx, 'day', parseInt(e.target.value))} />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs text-gray-500 mb-1">Başlık</label>
                                            <input type="text" className="w-full border rounded p-2" value={item.title} onChange={e => updateItineraryItem(idx, 'title', e.target.value)} placeholder="Örn: Mekke Ziyaretleri" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Lokasyon</label>
                                            <select className="w-full border rounded p-2" value={item.locationId || ''} onChange={e => updateItineraryItem(idx, 'locationId', e.target.value)}>
                                                <option value="">Seçiniz</option>
                                                {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Otel (Opsiyonel)</label>
                                            <select className="w-full border rounded p-2" value={item.hotelId || ''} onChange={e => updateItineraryItem(idx, 'hotelId', e.target.value)}>
                                                <option value="">Seçiniz</option>
                                                {hotels
                                                    .filter(h => !item.locationId || h.locationId === item.locationId) // Filter by selected location
                                                    .map(h => <option key={h.id} value={h.id}>{h.title}</option>)
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Açıklama</label>
                                    <textarea className="w-full border rounded p-2" rows={2} value={item.description || ''} onChange={e => updateItineraryItem(idx, 'description', e.target.value)} />
                                </div>
                            </div>
                        ))}
                        {formData.itinerary.length === 0 && (
                            <div className="text-center py-8 text-gray-500">Henüz program eklenmedi. "Gün Ekle" butonunu kullanın.</div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Medya ve İçerik</h2>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tur Kısa Açıklaması (Tüm listelerde görünür)</label>
                        <textarea className="w-full border rounded-lg p-2" rows={2} value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Özet (Tur detay sayfasında görünür)</label>
                        <textarea className="w-full border rounded-lg p-2" rows={3} value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} />
                    </div>
                    <RichTextEditor value={formData.content} onChange={(html) => setFormData({ ...formData, content: html })} label="Detaylı İçerik" />
                    <RichTextEditor
                        value={formData.excludedText || ''}
                        onChange={(html) => setFormData({ ...formData, excludedText: html })}
                        label="Fiyata Dahil Olmayan Hizmetler"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                        <ImageUpload 
                            value={formData.thumbnailUrl} 
                            onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })} 
                            label="Thumbnail (Liste Görseli)" 
                        />
                        <div className="flex flex-col justify-center">
                            <p className="text-sm font-bold text-gray-700 mb-2">Görsel Alanı Hakkında</p>
                            <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4">
                                <li>Thumbnail görseli site genelinde turların listelendiği kartlarda kullanılacaktır.</li>
                                <li>Yüklerken kırpma (crop) işlemi yaparak ideal boyuta getirebilirsiniz.</li>
                                <li>Tur sayfasındaki slider için aşağıdan Galeri görselleri eklemeye devam edebilirsiniz.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-6 border-t">
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium">Tur Galeri Görselleri (Slider)</label>
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold uppercase tracking-widest">Slider'da Boyut Sınırı Yoktur</span>
                        </div>
                        <GalleryUpload 
                            value={formData.gallery} 
                            onChange={(urls) => setFormData({ ...formData, gallery: urls })} 
                            label="" 
                            disabledCrop={true}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} />
                        <span className="text-sm font-medium text-gray-700">Öne Çıkan</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" name="status" value="draft" checked={formData.status === 'draft'} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
                        <span className="text-sm font-medium text-gray-700">Taslak</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" name="status" value="published" checked={formData.status === 'published'} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
                        <span className="text-sm font-medium text-gray-700">Yayında</span>
                    </label>
                </div>

                <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={saving} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-lg font-medium">
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                    <button type="button" onClick={() => router.push('/turlar')} className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 text-lg font-medium">
                        İptal
                    </button>
                </div>
            </form>
        </div>
    );
}
