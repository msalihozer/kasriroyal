import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';
import ContactForm from '@/components/contact/ContactForm';

async function getSettings() {
    try {
        const res = await fetch(`${process.env.API_BASE_URL || `${process.env.NEXT_PUBLIC_API_URL || ''}/api`}/site-settings`, { cache: 'no-store' });
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        return null;
    }
}

function getMapSrc(input: string | undefined | null) {
    if (!input) return null;
    // If user pasted the full iframe code, extract src
    const srcMatch = input.match(/src="([^"]+)"/);
    if (srcMatch && srcMatch[1]) return srcMatch[1];

    // If it's a direct URL, return it
    if (input.startsWith('http')) return input;

    return null;
}

export default async function ContactPage() {
    const settings = await getSettings();
    const mapSrc = getMapSrc(settings?.mapEmbedUrl);

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-black text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 uppercase !text-white drop-shadow-lg">İletişim</h1>
                    <p className="!text-white text-lg max-w-2xl mx-auto drop-shadow-md">
                        Sorularınız, rezervasyonlarınız veya önerileriniz için bizimle iletişime geçebilirsiniz.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="bg-white rounded-xl shadow-xl p-8 h-full flex flex-col justify-between">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8 border-b pb-4">İletişim Bilgileri</h2>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#bda569]/10 rounded-full flex items-center justify-center text-[#bda569] shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">Adresimiz</h3>
                                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                            {settings?.firmName && <strong className="block text-gray-700 mb-1">{settings.firmName}</strong>}
                                            {settings?.address || "Henüz adres bilgisi girilmemiş."}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#bda569]/10 rounded-full flex items-center justify-center text-[#bda569] shrink-0">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">Telefon</h3>
                                        <div className="flex flex-col gap-1">
                                            {Array.isArray(settings?.phones) && settings.phones.length > 0 ? (
                                                settings.phones.map((p: any, idx: number) => (
                                                    <div key={idx} className="flex flex-col">
                                                        {p.label && <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{p.label}</span>}
                                                        <a href={`tel:${p.number.replace(/\s/g, '')}`} className="text-gray-600 hover:text-[#bda569] transition-colors font-medium">
                                                            {p.number}
                                                        </a>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-600">
                                                    {settings?.phone ? (
                                                        <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-[#bda569] transition-colors">
                                                            {settings.phone}
                                                        </a>
                                                    ) : (
                                                        "Henüz telefon bilgisi girilmemiş."
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#bda569]/10 rounded-full flex items-center justify-center text-[#bda569] shrink-0">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">E-posta</h3>
                                        <p className="text-gray-600">
                                            {settings?.email ? (
                                                <a href={`mailto:${settings.email}`} className="hover:text-[#bda569] transition-colors">
                                                    {settings.email}
                                                </a>
                                            ) : (
                                                "Henüz e-posta bilgisi girilmemiş."
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="mt-12">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Bizi Takip Edin</h3>
                            <div className="flex gap-4">
                                {settings?.socialLinks?.instagram && (
                                    <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#E1306C] hover:text-white transition-all">
                                        <Instagram size={20} />
                                    </a>
                                )}
                                {settings?.socialLinks?.facebook && (
                                    <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#1877F2] hover:text-white transition-all">
                                        <Facebook size={20} />
                                    </a>
                                )}
                                {settings?.socialLinks?.youtube && (
                                    <a href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#FF0000] hover:text-white transition-all">
                                        <Youtube size={20} />
                                    </a>
                                )}
                                {settings?.socialLinks?.whatsapp && (
                                    <a href={`https://wa.me/${settings.socialLinks.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#25D366] hover:text-white transition-all">
                                        <Phone size={20} className="rotate-90" /> {/* Using Phone icon for WP if generic */}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="h-full">
                        <ContactForm />
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-12 bg-white rounded-xl shadow-xl p-2 h-[400px] overflow-hidden">
                    {mapSrc ? (
                        <iframe
                            src={mapSrc}
                            width="100%"
                            height="100%"
                            style={{ border: 0, borderRadius: '0.75rem' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    ) : (
                        <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                                <p>Harita konumu henüz eklenmemiş.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
