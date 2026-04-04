"use client";
import { useState, useEffect } from 'react';
import { Calendar, Users, Plane, Hotel, Car, MessageSquare, CheckCircle, ChevronRight, ChevronLeft, MapPin, ExternalLink, Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/utils/image-url';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';

const TURKISH_AIRPORTS = [
    { value: 'IST', label: 'İstanbul Havalimanı (IST)' },
    { value: 'SAW', label: 'Sabiha Gökçen Havalimanı (SAW)' },
    { value: 'ESB', label: 'Ankara Esenboğa Havalimanı (ESB)' },
    { value: 'ADB', label: 'İzmir Adnan Menderes Havalimanı (ADB)' },
    { value: 'AYT', label: 'Antalya Havalimanı (AYT)' },
    { value: 'ADA', label: 'Adana Şakirpaşa Havalimanı (ADA)' },
    { value: 'TZX', label: 'Trabzon Havalimanı (TZX)' },
    { value: 'DLM', label: 'Dalaman Havalimanı (DLM)' },
    { value: 'BJV', label: 'Milas-Bodrum Havalimanı (BJV)' },
    { value: 'GZT', label: 'Gaziantep Havalimanı (GZT)' },
    { value: 'KYK', label: 'Kayseri Havalimanı (KYK)' },
    { value: 'SZF', label: 'Samsun Çarşamba Havalimanı (SZF)' },
    { value: 'Bursa', label: 'Bursa Yenişehir Havalimanı (YEI)' },
    { value: 'Konya', label: 'Konya Havalimanı (KYA)' },
    { value: 'Diyarbakir', label: 'Diyarbakır Havalimanı (DIY)' },
    { value: 'Erzurum', label: 'Erzurum Havalimanı (ERZ)' },
    { value: 'Van', label: 'Van Ferit Melen Havalimanı (VAN)' },
    { value: 'Hatay', label: 'Hatay Havalimanı (HTY)' },
    { value: 'Malatya', label: 'Malatya Erhaç Havalimanı (MLX)' },
].sort((a, b) => a.label.localeCompare(b.label));

interface CustomTourFormProps {
    hotels: any[];
    vehicles: any[];
}

export default function CustomTourForm({ hotels: initialHotels = [], vehicles: initialVehicles = [] }: CustomTourFormProps) {
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [showSummary, setShowSummary] = useState(false);

    // Client-side data fetching state
    const [hotels, setHotels] = useState<any[]>(initialHotels);
    const [vehicles, setVehicles] = useState<any[]>(initialVehicles);
    const [dataLoading, setDataLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // If data is missing (e.g. build time fetch failed), fetch it client-side
        if ((hotels.length === 0 || vehicles.length === 0) && !dataLoading) {
            const fetchData = async () => {
                setDataLoading(true);
                setError(null);
                try {
                    // Try defaulting to localhost:4000 if env var is missing
                    const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || ''}/api`;
                    console.log(`Fetching from ${API_BASE}...`);

                    const [hRes, vRes] = await Promise.all([
                        fetch(`${API_BASE}/hotels`).catch(err => { throw new Error(`Hotels API Error: ${err.message}`) }),
                        fetch(`${API_BASE}/vehicles`).catch(err => { throw new Error(`Vehicles API Error: ${err.message}`) })
                    ]);

                    if (hRes.ok) {
                        const hData = await hRes.json();
                        setHotels(Array.isArray(hData) ? hData : (hData.data || []));
                    } else {
                        console.error("Hotels fetch failed:", hRes.status, hRes.statusText);
                    }

                    if (vRes.ok) {
                        const vData = await vRes.json();
                        setVehicles(Array.isArray(vData) ? vData : (vData.data || []));
                    } else {
                        console.error("Vehicles fetch failed:", vRes.status, vRes.statusText);
                    }

                } catch (err: any) {
                    console.error("Client-side fetch error:", err);
                    setError(err.message || "Veri yüklenirken bir hata oluştu.");
                } finally {
                    setDataLoading(false);
                }
            };
            fetchData();
        }
    }, []);

    // Initial State
    const [formData, setFormData] = useState({
        // Step 1: Personal
        fullName: '',
        phone: '',
        email: '',
        adultCount: 1,
        childCount: 0,

        // Step 2: Dates & Flights
        startDate: '',
        mekkeDays: 3,
        medineDays: 3,
        airline: '',
        flightClass: 'Economy',
        departureCity: '',

        // Step 3: Hotels & Transfer
        selectedMekkeHotelId: '', // ID of selected hotel
        selectedMedineHotelId: '', // ID of selected hotel
        selectedVehicleId: '', // ID of selected vehicle

        // Step 4: Extras
        guideRequested: false,
        message: ''
    });

    // Filtering hotels by city (Assuming 'city' field exists or filtering by name/logic, 
    // but here we'll assume the API returns a 'city' or we just list all and let user pick)
    // For a better UX, let's try to filter if possible, otherwise list all.
    // Based on previous code, we didn't see explicit city field. Let's assume we show all or basic filter.
    // Actually, normally hotels have a location/city field. 
    const toStr = (val: any) => {
        if (typeof val === 'object' && val !== null) {
            return String(val.name || val.city || JSON.stringify(val)).toLowerCase();
        }
        return String(val || '').toLowerCase();
    };

    // Filtering with safe string conversion
    // We explicitly check location.name because location is likely an object relation
    const mekkeHotels = hotels.filter(h =>
        toStr(h.city).includes('mekke') ||
        toStr(h.title).includes('mekke') ||
        toStr(h.location).includes('mekke')
    );
    const medineHotels = hotels.filter(h =>
        toStr(h.city).includes('medine') ||
        toStr(h.title).includes('medine') ||
        toStr(h.location).includes('medine')
    );

    // Removing the fallback to prevent showing Mekke hotels in Medine list when Medine is empty.
    const effectiveMekkeHotels = mekkeHotels;
    const effectiveMedineHotels = medineHotels;


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSelection = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        // Basic validation
        if (step === 1 && (!formData.fullName || !formData.phone)) {
            alert("Lütfen ad soyad ve telefon bilgilerinizi giriniz.");
            return;
        }
        if (step === 2 && (!formData.startDate || !formData.departureCity)) {
            alert("Lütfen gidiş tarihi ve kalkış yerini belirtiniz.");
            return;
        }
        if (step === 4) {
            setShowSummary(true);
            return;
        }
        setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            personCount: Number(formData.adultCount || 0) + Number(formData.childCount || 0),

            // Getting full object details for submission
            mekkeHotel: hotels.find(h => h.id === formData.selectedMekkeHotelId)?.title || (formData.selectedMekkeHotelId === 'others' ? 'Farklı Bir Otel' : ''),
            medineHotel: hotels.find(h => h.id === formData.selectedMedineHotelId)?.title || (formData.selectedMedineHotelId === 'others' ? 'Farklı Bir Otel' : ''),
            vehicle: vehicles.find(v => v.id === formData.selectedVehicleId)?.modelName,
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/custom-tour-requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                alert('Bir hata oluştu. Lütfen tekrar deneyiniz.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Bir bağlantı hatası oluştu.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Talebiniz Alındı</h2>
                <p className="text-gray-600 text-lg mb-8">
                    Hayalinizdeki umre turunu planlamak için bize ilettiğiniz bilgiler başarıyla kaydedildi.
                    Uzman ekibimiz en kısa sürede sizinle iletişime geçerek detayları görüşecektir.
                </p>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500">
                        Sorularınız için <a href="/iletisim" className="text-[#bda569] font-bold underline">İletişim</a> sayfamızdan bize ulaşabilirsiniz.
                    </p>
                </div>
            </div>
        );
    }

    // Progress Bar
    const renderStepIndicator = () => (
        <div className="flex justify-center mb-10">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step === i ? 'bg-[#bda569] text-white ring-4 ring-[#bda569]/20' : step > i ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                        {step > i ? <CheckCircle size={18} /> : i}
                    </div>
                    {i < 4 && (
                        <div className={`w-12 h-1 mx-2 ${step > i ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto">
            {renderStepIndicator()}

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
                <div className="flex-1 p-6 md:p-10">

                    {/* STEP 1: Personal Info */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="flex items-center gap-3 mb-8 pb-4 border-b">
                                <Users className="text-[#bda569]" size={32} />
                                <div>
                                    <h2 className="text-2xl font-serif font-bold text-gray-900">Kişisel Bilgileriniz</h2>
                                    <p className="text-gray-500 text-sm">Size ulaşabilmemiz için iletişim bilgilerinizi giriniz.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Ad Soyad</label>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#bda569] outline-none transition-all" placeholder="Adınız ve Soyadınız" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Telefon</label>
                                    <PhoneInput
                                        country={'tr'}
                                        value={formData.phone}
                                        onChange={phone => setFormData(prev => ({ ...prev, phone }))}
                                        inputClass="!w-full !h-[50px] !rounded-xl !border-gray-300 !focus:ring-2 !focus:ring-[#bda569]"
                                        containerClass="!w-full"
                                        buttonClass="!rounded-l-xl !border-gray-300"
                                        placeholder="+90 555 555 55 55"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">E-posta</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-[13px] rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#bda569] outline-none transition-all" placeholder="ornek@email.com" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Yetişkin</label>
                                        <input type="number" min="1" max="50" name="adultCount" value={formData.adultCount} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#bda569] outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Çocuk (0-12)</label>
                                        <input type="number" min="0" max="50" name="childCount" value={formData.childCount} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#bda569] outline-none transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Flights & Dates */}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="flex items-center gap-3 mb-8 pb-4 border-b">
                                <Plane className="text-[#bda569]" size={32} />
                                <div>
                                    <h2 className="text-2xl font-serif font-bold text-gray-900">Uçuş ve Tarih Planı</h2>
                                    <p className="text-gray-500 text-sm">Gidiş tarihi, kalış süreleri ve uçuş tercihlerinizi belirleyin.</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Planlanan Gidiş Tarihi</label>
                                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#bda569] outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Mekke Süresi</label>
                                        <select name="mekkeDays" value={formData.mekkeDays} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#bda569] outline-none bg-white">
                                            {[...Array(15)].map((_, i) => <option key={i} value={i + 1}>{i + 1} Gece</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Medine Süresi</label>
                                        <select name="medineDays" value={formData.medineDays} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#bda569] outline-none bg-white">
                                            {[...Array(15)].map((_, i) => <option key={i} value={i + 1}>{i + 1} Gece</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Kalkış Yeri (Havalimanı)</label>
                                        <Select
                                            options={TURKISH_AIRPORTS}
                                            value={TURKISH_AIRPORTS.find(a => a.value === formData.departureCity)}
                                            onChange={(val: any) => handleSelection('departureCity', val?.value)}
                                            placeholder="Havalimanı seçiniz..."
                                            noOptionsMessage={() => "Havalimanı bulunamadı"}
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    borderRadius: '12px',
                                                    padding: '4px',
                                                    borderColor: '#d1d5db'
                                                })
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Havayolu Şirketi</label>
                                        <select name="airline" value={formData.airline} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#bda569] bg-white outline-none">
                                            <option value="">Farketmez / En Uygunu</option>
                                            <option value="THY">Türk Hava Yolları</option>
                                            <option value="Saudia">Saudia Airlines</option>
                                            <option value="Pegasus">Pegasus</option>
                                            <option value="Flynas">Flynas</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Uçuş Sınıfı</label>
                                        <div className="flex gap-4">
                                            {['Economy', 'Business'].map(cls => (
                                                <label key={cls} className={`flex-1 border-2 rounded-xl p-3 cursor-pointer transition-all ${formData.flightClass === cls ? 'bg-white border-[#bda569] text-[#bda569]' : 'bg-white border-transparent hover:bg-gray-100'}`}>
                                                    <input type="radio" name="flightClass" value={cls} checked={formData.flightClass === cls} onChange={handleChange} className="hidden" />
                                                    <div className="font-bold text-center">{cls === 'Economy' ? 'Ekonomi' : 'Business'}</div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Hotels & Transfer */}
                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            {/* Empty State Warning */}
                            {!dataLoading && !error && hotels.length === 0 && (
                                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-xl mb-6 border border-yellow-100">
                                    <p className="font-bold mb-1">Uyarı: Otel listesi boş.</p>
                                    <p className="text-sm">Veritabanında otel bulunamadı veya bağlantı sağlanamadı.</p>
                                    <p className="text-xs text-gray-500 mt-2 font-mono">
                                        API: {process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || ''}/api`}
                                    </p>
                                </div>
                            )}
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                                <Hotel className="text-[#bda569]" size={32} />
                                <div>
                                    <h2 className="text-2xl font-serif font-bold text-gray-900">Otel ve Transfer Seçimi</h2>
                                    <p className="text-gray-500 text-sm">Konaklamak istediğiniz otelleri ve transfer hizmetini seçiniz.</p>
                                </div>
                            </div>

                            {/* Mekke Otelleri */}
                            <div className="mb-12">
                                <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><MapPin size={24} className="text-[#bda569]" /> Mekke Oteli Seçimi</h3>
                                <div className="relative group/carousel">
                                    <div className="flex overflow-x-auto gap-6 pb-6 snap-x no-scrollbar scroll-smooth">
                                        {effectiveMekkeHotels.length === 0 && (
                                            <div className="min-w-full p-8 bg-blue-50 text-blue-800 rounded-2xl border border-blue-100 flex items-center justify-center gap-3">
                                                <Info size={20} />
                                                Sistemde gösterilecek Mekke oteli bulunamadı. Lütfen sağdaki &quot;Farklı Bir Otel&quot; seçeneğiyle devam edin.
                                            </div>
                                        )}
                                        {effectiveMekkeHotels.map(hotel => (
                                            <div key={hotel.id}
                                                onClick={() => handleSelection('selectedMekkeHotelId', String(hotel.id))}
                                                className={`min-w-[280px] md:min-w-[320px] snap-start relative border-2 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 ${String(formData.selectedMekkeHotelId) === String(hotel.id) ? 'ring-4 ring-[#bda569]/20 border-[#bda569]' : 'border-gray-100 hover:border-[#bda569]/50 shadow-sm hover:shadow-md'}`}
                                            >
                                                <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
                                                    <img
                                                        src={hotel.imageUrl ? getImageUrl(hotel.imageUrl) : 'https://images.unsplash.com/photo-1565552629477-09be08370df4?q=80&w=2000'}
                                                        alt={hotel.title || 'Otel'}
                                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                                                    {(hotel.locationText || hotel.distance) && (
                                                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                                            <MapPin size={12} className="text-[#bda569]" /> {hotel.locationText || hotel.distance}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-5">
                                                    <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">{hotel.title}</h4>
                                                    <div className="flex text-yellow-400 text-sm mb-3">
                                                        {Array(hotel.stars || 5).fill(0).map((_, i) => <span key={i}>★</span>)}
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <Link
                                                            href={`/oteller/${hotel.slug}`}
                                                            target="_blank"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-xs font-bold text-[#bda569] hover:underline flex items-center gap-1"
                                                        >
                                                            Detaylar <ExternalLink size={12} />
                                                        </Link>
                                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${String(formData.selectedMekkeHotelId) === String(hotel.id) ? 'bg-[#bda569] border-[#bda569] scale-110 shadow-lg shadow-[#bda569]/30' : 'border-gray-200 bg-white'}`}>
                                                            {String(formData.selectedMekkeHotelId) === String(hotel.id) ? <CheckCircle size={16} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-gray-200" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Others / Custom Choice Card */}
                                        <div
                                            onClick={() => handleSelection('selectedMekkeHotelId', 'others')}
                                            className={`min-w-[200px] snap-start border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-6 cursor-pointer transition-all duration-300 ${formData.selectedMekkeHotelId === 'others' ? 'bg-[#bda569]/5 border-[#bda569] ring-4 ring-[#bda569]/10' : 'border-gray-200 hover:border-[#bda569]/50 hover:bg-gray-50'}`}
                                        >
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-[#bda569]">
                                                <Hotel size={24} />
                                            </div>
                                            <span className="font-bold text-gray-900 mb-2">Farklı Bir Otel</span>
                                            <span className="text-xs text-gray-500">Size özel bir<br/>teklif hazırlayalım</span>
                                        </div>
                                    </div>
                                    
                                    {/* Carousel Indicators for scroll hints on mobile */}
                                    <div className="md:hidden flex justify-center gap-1.5 mt-2">
                                        <div className="w-8 h-1 bg-[#bda569] rounded-full"></div>
                                        <div className="w-2 h-1 bg-gray-200 rounded-full"></div>
                                        <div className="w-2 h-1 bg-gray-200 rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Medine Otelleri */}
                            <div className="mb-12">
                                <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><MapPin size={24} className="text-[#bda569]" /> Medine Oteli Seçimi</h3>
                                <div className="relative group/carousel">
                                    <div className="flex overflow-x-auto gap-6 pb-6 snap-x no-scrollbar scroll-smooth">
                                        {effectiveMedineHotels.length === 0 && (
                                            <div className="min-w-full p-8 bg-blue-50 text-blue-800 rounded-2xl border border-blue-100 flex items-center justify-center gap-3">
                                                <Info size={20} />
                                                Sistemde gösterilecek Medine oteli bulunamadı. Lütfen sağdaki &quot;Farklı Bir Otel&quot; seçeneğiyle devam edin.
                                            </div>
                                        )}
                                        {effectiveMedineHotels.map(hotel => (
                                            <div key={hotel.id}
                                                onClick={() => handleSelection('selectedMedineHotelId', String(hotel.id))}
                                                className={`min-w-[280px] md:min-w-[320px] snap-start relative border-2 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 ${String(formData.selectedMedineHotelId) === String(hotel.id) ? 'ring-4 ring-[#bda569]/20 border-[#bda569]' : 'border-gray-100 hover:border-[#bda569]/50 shadow-sm hover:shadow-md'}`}
                                            >
                                                <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
                                                    <img
                                                        src={hotel.imageUrl ? getImageUrl(hotel.imageUrl) : 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=2000'}
                                                        alt={hotel.title || 'Otel'}
                                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                                                    {(hotel.locationText || hotel.distance) && (
                                                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                                            <MapPin size={12} className="text-[#bda569]" /> {hotel.locationText || hotel.distance}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-5">
                                                    <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">{hotel.title}</h4>
                                                    <div className="flex text-yellow-400 text-sm mb-3">
                                                        {Array(hotel.stars || 5).fill(0).map((_, i) => <span key={i}>★</span>)}
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <Link
                                                            href={`/oteller/${hotel.slug}`}
                                                            target="_blank"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-xs font-bold text-[#bda569] hover:underline flex items-center gap-1"
                                                        >
                                                            Detaylar <ExternalLink size={12} />
                                                        </Link>
                                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${String(formData.selectedMedineHotelId) === String(hotel.id) ? 'bg-[#bda569] border-[#bda569] scale-110 shadow-lg shadow-[#bda569]/30' : 'border-gray-200 bg-white'}`}>
                                                            {String(formData.selectedMedineHotelId) === String(hotel.id) ? <CheckCircle size={16} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-gray-200" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div
                                            onClick={() => handleSelection('selectedMedineHotelId', 'others')}
                                            className={`min-w-[200px] snap-start border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-6 cursor-pointer transition-all duration-300 ${formData.selectedMedineHotelId === 'others' ? 'bg-[#bda569]/5 border-[#bda569] ring-4 ring-[#bda569]/10' : 'border-gray-200 hover:border-[#bda569]/50 hover:bg-gray-50'}`}
                                        >
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-[#bda569]">
                                                <Hotel size={24} />
                                            </div>
                                            <span className="font-bold text-gray-900 mb-2">Farklı Bir Otel</span>
                                            <span className="text-xs text-gray-500">Size özel bir<br/>teklif hazırlayalım</span>
                                        </div>
                                    </div>
                                    <div className="md:hidden flex justify-center gap-1.5 mt-2">
                                        <div className="w-8 h-1 bg-[#bda569] rounded-full"></div>
                                        <div className="w-2 h-1 bg-gray-200 rounded-full"></div>
                                        <div className="w-2 h-1 bg-gray-200 rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Transfer Seçimi */}
                            <div>
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Car size={20} className="text-gray-400" /> Ara Transfer Hizmeti (Mekke - Medine)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {vehicles.map(vehicle => (
                                        <div key={vehicle.id}
                                            onClick={() => handleSelection('selectedVehicleId', String(vehicle.id))}
                                            className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:border-blue-300 transition-all ${String(formData.selectedVehicleId) === String(vehicle.id) ? 'ring-2 ring-[#bda569] border-[#bda569] bg-orange-50/10' : 'border-gray-200'}`}
                                        >
                                            <div className="w-24 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={vehicle.imageUrl ? getImageUrl(vehicle.imageUrl) : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2000'}
                                                    alt={vehicle.modelName}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900">{vehicle.modelName}</h4>
                                                <div className="text-xs text-gray-500 leading-relaxed max-h-16 overflow-y-auto pr-2 custom-scrollbar">
                                                    {vehicle.description}
                                                </div>
                                                <div className="flex items-center gap-3 mt-2">
                                                    {vehicle.showCapacity !== false && (
                                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                                                            <Users size={12} /> Kapasite: {vehicle.capacity || '4+'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${String(formData.selectedVehicleId) === String(vehicle.id) ? 'bg-[#bda569] border-[#bda569]' : 'border-gray-300'}`}>
                                                {String(formData.selectedVehicleId) === String(vehicle.id) && <CheckCircle size={14} className="text-white" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Extras & Summary */}
                    {step === 4 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                                <MessageSquare className="text-[#bda569]" size={32} />
                                <div>
                                    <h2 className="text-2xl font-serif font-bold text-gray-900">Son Adım: Onay ve Mesaj</h2>
                                    <p className="text-gray-500 text-sm">Özel isteklerinizi belirtip formu tamamlayın.</p>
                                </div>
                            </div>

                            <div className="mb-8 p-4 border rounded-xl bg-gray-50 hover:bg-white transition-colors cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, guideRequested: !prev.guideRequested }))}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded border flex items-center justify-center ${formData.guideRequested ? 'bg-[#bda569] border-[#bda569]' : 'border-gray-400 bg-white'}`}>
                                        {formData.guideRequested && <CheckCircle size={16} className="text-white" />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">Özel Rehber Hoca Hizmeti İstiyorum</div>
                                        <div className="text-sm text-gray-500">İbadetlerinizde size eşlik edecek deneyimli rehber.</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Eklemek İstedikleriniz / Özel Notunuz</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#bda569] outline-none" placeholder="Örn: Bebek yatağı istiyorum, tekerlekli sandalye ihtiyacım var..." />
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg text-yellow-800 text-sm mb-6">
                                <Info className="shrink-0 mt-0.5" size={18} />
                                <span>Gönder butonuna bastıktan sonra uzmanlarımız seçtiğiniz kriterlere en uygun paketi hazırlayıp size dönüş yapacaktır.</span>
                            </div>

                            <div className="mb-4">
                                <label className="flex items-center cursor-pointer gap-2">
                                    <input type="checkbox" checked={isConfirmed} onChange={e => setIsConfirmed(e.target.checked)} className="w-5 h-5 accent-[#bda569]" />
                                    <span className="font-bold text-gray-700 text-sm">Bilgilerin doğruluğunu onaylıyorum.</span>
                                </label>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Navigation */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                    {step > 1 && (
                        <button type="button" onClick={prevStep} className="flex items-center gap-2 px-6 py-3 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">
                            <ChevronLeft size={20} /> Geri
                        </button>
                    )}
                    <div className="ml-auto">
                        <button type="button" onClick={nextStep} className="bg-[#bda569] hover:bg-[#a38b55] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl">
                            {step < 4 ? 'Devam Et' : 'Özeti Gör'} <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </form >

            {/* Summary Modal */}
            {showSummary && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSummary(false)}></div>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-[#bda569] p-6 text-white">
                            <h3 className="text-2xl font-serif font-bold">Tur Talebi Özeti</h3>
                            <p className="opacity-90 text-sm">Lütfen bilgilerinizin doğruluğunu kontrol ediniz.</p>
                        </div>
                        <div className="p-8 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                                <div>
                                    <h4 className="font-bold text-gray-400 uppercase text-xs mb-3 tracking-wider">İletişim Bilgileri</h4>
                                    <p className="text-gray-900 font-bold text-lg mb-1">{formData.fullName}</p>
                                    <p className="text-gray-600">{formData.phone}</p>
                                    <p className="text-gray-600">{formData.email || '-'}</p>
                                    <p className="mt-2 inline-block bg-gray-100 px-3 py-1 rounded-full font-bold">
                                        {formData.adultCount} Yetişkin + {formData.childCount} Çocuk
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-400 uppercase text-xs mb-3 tracking-wider">Uçuş Bilgileri</h4>
                                    <p className="text-gray-900 font-bold">{TURKISH_AIRPORTS.find(a => a.value === formData.departureCity)?.label || formData.departureCity}</p>
                                    <p className="text-gray-600">{formData.startDate} gidiş</p>
                                    <p className="text-gray-600">{formData.airline || 'En Uygun Havayolu'} ({formData.flightClass === 'Economy' ? 'Ekonomi' : 'Business'})</p>
                                </div>
                                <div className="md:col-span-2 border-t pt-6">
                                    <h4 className="font-bold text-gray-400 uppercase text-xs mb-3 tracking-wider">Konaklama ve Transfer</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-[#bda569] font-bold text-xs mb-1">MEKKE ({formData.mekkeDays} Gece)</p>
                                            <p className="font-bold">{hotels.find(h => h.id === formData.selectedMekkeHotelId)?.title || (formData.selectedMekkeHotelId === 'others' ? 'Farklı Bir Otel' : '-')}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-[#bda569] font-bold text-xs mb-1">MEDİNE ({formData.medineDays} Gece)</p>
                                            <p className="font-bold">{hotels.find(h => h.id === formData.selectedMedineHotelId)?.title || (formData.selectedMedineHotelId === 'others' ? 'Farklı Bir Otel' : '-')}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 bg-gray-50 p-4 rounded-xl">
                                        <p className="text-gray-500 text-xs mb-1">ARA TRANSFER & EKSTRALAR</p>
                                        <p className="font-bold">{vehicles.find(v => v.id === formData.selectedVehicleId)?.modelName || 'Seçilmedi'}</p>
                                        {formData.guideRequested && <p className="text-green-600 text-xs font-bold mt-1">✓ Özel Rehber Hizmeti İstiyorum</p>}
                                    </div>
                                </div>
                                {formData.message && (
                                    <div className="md:col-span-2 border-t pt-6">
                                        <h4 className="font-bold text-gray-400 uppercase text-xs mb-2 tracking-wider">Özel Not</h4>
                                        <p className="text-gray-600 italic">"{formData.message}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-6 bg-gray-100 border-t flex flex-col sm:flex-row gap-4">
                            <button type="button" onClick={() => setShowSummary(false)} className="flex-1 px-8 py-4 bg-white border border-gray-300 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all">
                                Düzenle
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-[2] px-8 py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl shadow-green-600/20 disabled:opacity-50"
                            >
                                {loading ? 'Gönderiliyor...' : 'Talebimi Onaylıyorum ve Gönder'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
