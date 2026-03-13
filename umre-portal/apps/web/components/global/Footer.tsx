"use client";
import { useSiteSettings } from '../../context/SiteSettingsContext';

export default function Footer() {
    const { footerDiyanetImageUrl, footerAgencyImageUrl, footerLogos } = useSiteSettings();

    const legalLinks = [
        { title: "KVKK Aydınlatma Metni", href: "/kurumsal/kvkk" },
        { title: "Açık Rıza Metni", href: "/kurumsal/acik-riza" },
        { title: "Gizlilik Politikası", href: "/kurumsal/gizlilik-politikasi" },
        { title: "Çerez Politikası", href: "/kurumsal/cerez-politikasi" },
        { title: "Mesafeli Satış Sözleşmesi", href: "/kurumsal/mesafeli-satis" },
        { title: "İptal & İade Koşulları", href: "/kurumsal/iptal-iade" },
        { title: "Kullanım Koşulları", href: "/kurumsal/kullanim-kosullari" },
    ];

    return (
        <footer className="bg-secondary-900 text-white pt-16 pb-8 border-t border-secondary-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Column 1: Kurumsal */}
                    <div>
                        <h3 className="font-serif font-bold text-xl mb-6 text-[#bda569]">Kurumsal</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Hac ve Umre organizasyonlarında yılların verdiği tecrübe ve güvenle, siz değerli misafirlerimize en iyi hizmeti sunmaktan gurur duyuyoruz.
                        </p>
                        <div className="text-gray-400 text-sm space-y-2">
                            <a href="/iletisim" className="block hover:text-[#bda569] transition-colors">İletişim</a>
                            <a href="/hakkimizda" className="block hover:text-[#bda569] transition-colors">Hakkımızda</a>
                        </div>
                    </div>

                    {/* Column 2: Site Haritası */}
                    <div>
                        <h3 className="font-serif font-bold text-xl mb-6 text-[#bda569]">Site Haritası</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="/" className="hover:text-white transition-colors flex items-center gap-2">Anasayfa</a></li>
                            <li><a href="/turlar" className="hover:text-white transition-colors flex items-center gap-2">Turlar</a></li>
                            <li><a href="/oteller" className="hover:text-white transition-colors flex items-center gap-2">Oteller</a></li>
                            <li><a href="/blog" className="hover:text-white transition-colors flex items-center gap-2">Blog & Haberler</a></li>
                            <li><a href="/iletisim" className="hover:text-white transition-colors flex items-center gap-2">İletişim</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Resmi Üyelikler */}
                    <div>
                        <h3 className="font-serif font-bold text-xl mb-6 text-[#bda569]">Resmi Üyelikler</h3>
                        <div className="flex flex-wrap gap-4">
                            {Array.isArray(footerLogos) && footerLogos.length > 0 ? (
                                footerLogos.map((logo: any, idx: number) => (
                                    <div key={idx} className="bg-white p-3 rounded-lg w-24 h-24 flex items-center justify-center">
                                        <img
                                            src={logo.imageUrl ? (logo.imageUrl.startsWith('http') ? logo.imageUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${logo.imageUrl}`) : '/logo.png'}
                                            alt={logo.alt || 'Üyelik'}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                ))
                            ) : (
                                <>
                                    {footerDiyanetImageUrl && (
                                        <div className="bg-white p-3 rounded-lg w-24 h-24 flex items-center justify-center">
                                            <img src={footerDiyanetImageUrl} alt="Diyanet" className="max-w-full max-h-full object-contain" />
                                        </div>
                                    )}
                                    {footerAgencyImageUrl && (
                                        <div className="bg-white p-3 rounded-lg w-24 h-24 flex items-center justify-center">
                                            <img src={footerAgencyImageUrl} alt="TURSAB" className="max-w-full max-h-full object-contain" />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Column 4: Sözleşmeler */}
                    <div>
                        <h3 className="font-serif font-bold text-xl mb-6 text-[#bda569]">Sözleşmeler</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            {legalLinks.map((link, idx) => (
                                <li key={idx}>
                                    <a href={link.href} className="hover:text-white transition-colors flex items-center gap-2">
                                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                        {link.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Tüm hakları saklıdır.
                    </p>
                    <div className="flex gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Optional payment icons or extra branding can go here */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
