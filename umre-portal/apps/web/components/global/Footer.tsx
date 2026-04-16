"use client";
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, Send } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    const settings = useSiteSettings();
    const { 
        footerLogos, 
        address, 
        phone, 
        phones, 
        email, 
        firmName, 
        socialLinks,
        footerDiyanetImageUrl,
        footerAgencyImageUrl,
        kvkkText,
        privacyPolicyText,
        distanceSalesText,
        cancellationText
    } = settings;

    const legalLinks = [
        { title: "KVKK Aydınlatma Metni", href: "/kurumsal/kvkk", exists: !!kvkkText },
        { title: "Gizlilik Politikası", href: "/kurumsal/gizlilik-politikasi", exists: !!privacyPolicyText },
        { title: "Mesafeli Satış Sözleşmesi", href: "/kurumsal/mesafeli-satis", exists: !!distanceSalesText },
        { title: "İptal & İade Koşulları", href: "/kurumsal/iptal-iade", exists: !!cancellationText },
    ].filter(l => l.exists);

    const sitemapLinks = [
        { title: "Anasayfa", href: "/" },
        { title: "Turlar", href: "/turlar" },
        { title: "VIP Umre", href: "/vip-umre" },
        { title: "Oteller", href: "/oteller" },
        { title: "Blog & Haberler", href: "/blog" },
        { title: "İletişim", href: "/iletisim" },
    ];

    const socialIcons = [
        { id: 'instagram', icon: <Instagram size={20} />, href: socialLinks?.instagram },
        { id: 'facebook', icon: <Facebook size={20} />, href: socialLinks?.facebook },
        { id: 'x', icon: <Twitter size={20} />, href: socialLinks?.x || socialLinks?.twitter },
        { id: 'youtube', icon: <Youtube size={20} />, href: socialLinks?.youtube },
    ].filter(s => s.href);

    return (
        <footer className="bg-[#0f1115] text-white pt-20 pb-10 border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Column 1: Kurumsal & Brand */}
                    <div className="space-y-6">
                        <h3 className="font-serif font-bold text-2xl text-[#bda569]">
                            {firmName || 'Kasrı Royal'}
                        </h3>
                        <p className="text-white text-xs font-bold tracking-[0.2em] uppercase -mt-2 mb-4">
                            BELGE NO: 18760
                        </p>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Kutsal topraklara yapacağınız yolculukta tecrübe ve güvenin adresi. Size özel butik hizmet anlayışıyla yanınızdayız.
                        </p>
                        <div className="flex gap-3">
                            {socialIcons.map(social => (
                                <a 
                                    key={social.id}
                                    href={social.href} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#bda569] hover:text-white transition-all duration-300"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Site Haritası */}
                    <div>
                        <h3 className="font-serif font-bold text-lg mb-8 text-[#bda569] uppercase tracking-widest">Site Haritası</h3>
                        <ul className="space-y-4">
                            {sitemapLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.href} className="text-gray-400 hover:text-[#bda569] transition-colors text-sm flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#bda569]/30 group-hover:bg-[#bda569] transition-colors"></span>
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: İletişim */}
                    <div>
                        <h3 className="font-serif font-bold text-lg mb-8 text-[#bda569] uppercase tracking-widest">İletişim</h3>
                        <ul className="space-y-5 text-sm">
                            {(address || firmName) && (
                                <li className="flex gap-4 items-start text-gray-400">
                                    <MapPin size={20} className="text-[#bda569] shrink-0" />
                                    <span>{address || 'İstanbul, Türkiye'}</span>
                                </li>
                            )}
                            {(phone || phones?.length > 0) && (
                                <li className="flex gap-4 items-center text-gray-400">
                                    <Phone size={20} className="text-[#bda569] shrink-0" />
                                    <div className="flex flex-col">
                                        <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
                                        {Array.isArray(phones) && phones.slice(0, 1).map((p: any, i: number) => (
                                            <a key={i} href={`tel:${p.number || p}`} className="hover:text-white transition-colors text-xs opacity-70">
                                                {p.label ? `${p.label}: ` : ''}{p.number || p}
                                            </a>
                                        ))}
                                    </div>
                                </li>
                            )}
                            {email && (
                                <li className="flex gap-4 items-center text-gray-400">
                                    <Mail size={20} className="text-[#bda569] shrink-0" />
                                    <a href={`mailto:${email}`} className="hover:text-white transition-colors tracking-wide">{email}</a>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Column 4: Üyelikler & Logolar */}
                    <div>
                        <h3 className="font-serif font-bold text-lg mb-8 text-[#bda569] uppercase tracking-widest">Resmi Üyelikler</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {Array.isArray(footerLogos) && footerLogos.length > 0 ? (
                                footerLogos.map((logo: any, idx: number) => (
                                    <div key={idx} className="bg-white/5 p-3 rounded-xl aspect-square flex items-center justify-center group hover:bg-white/10 transition-colors">
                                        <img
                                            src={logo.imageUrl ? (logo.imageUrl.startsWith('http') ? logo.imageUrl : `${process.env.NEXT_PUBLIC_API_URL || ''}${logo.imageUrl}`) : '/logo.png'}
                                            alt={logo.alt || 'Üyelik'}
                                            className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                                        />
                                    </div>
                                ))
                            ) : (
                                <>
                                    {[footerDiyanetImageUrl, footerAgencyImageUrl].filter(Boolean).map((url, idx) => (
                                        <div key={idx} className="bg-white/5 p-3 rounded-xl aspect-square flex items-center justify-center group hover:bg-white/10 transition-colors">
                                            <img src={url!} alt="Resmi Üye" className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.2em] text-gray-500">
                        {legalLinks.map((link, idx) => (
                            <Link key={idx} href={link.href} className="hover:text-[#bda569] transition-colors">{link.title}</Link>
                        ))}
                    </div>
                    <div className="text-center md:text-right">
                        <p className="text-gray-600 text-[11px] uppercase tracking-widest mb-1" suppressHydrationWarning>
                            &copy; {new Date().getFullYear()} {firmName || 'Kasrı Royal'}. Tüm hakları saklıdır.
                        </p>
                        <p className="text-gray-700 text-[9px] hover:text-[#bda569] transition-colors cursor-pointer">
                            Designed by Muhammed Salih Özer
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
