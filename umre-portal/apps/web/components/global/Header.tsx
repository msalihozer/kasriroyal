"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { Menu, X } from 'lucide-react';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { logoUrl, faviconUrl } = useSiteSettings();
    const [scrolled, setScrolled] = useState(false);
    const [menu, setMenu] = useState<any[]>([]);
    const [currentLang, setCurrentLang] = useState('tr');

    const handleLanguageChange = (lang: string) => {
        // Set cookie for Google Translate
        // Format: /source/target or /auto/target
        // We use /tr/target since site is Turkish
        const cookieValue = `/tr/${lang}`;
        document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
        document.cookie = `googtrans=${cookieValue}; path=/; domain=.${window.location.hostname}`; // for subdomains if any

        setCurrentLang(lang);
        window.location.reload();
    };

    useEffect(() => {
        // Read current language from cookie
        const cookies = document.cookie.split(';');
        const gtCookie = cookies.find(c => c.trim().startsWith('googtrans='));
        if (gtCookie) {
            const val = gtCookie.split('=')[1];
            // val is like /tr/en, we want 'en'
            const parts = val.split('/');
            if (parts.length > 0) {
                setCurrentLang(parts[parts.length - 1]);
            }
        }
    }, []);

    const pathname = usePathname();
    const isHome = pathname === '/';

    useEffect(() => {
        // Fetch menu from API in real implementation
        setMenu([
            { label: 'Anasayfa', url: '/' },
            { label: 'VIP UMRE NEDİR', url: '/vip-umre' },
            { label: 'Turlar', url: '/turlar' },
            { label: 'Oteller', url: '/oteller' },
            { label: 'Transfer', url: '/araclar' },
            { label: 'Blog', url: '/blog' },
            { label: 'Hakkımızda', url: '/hakkimizda' },
            { label: 'İletişim', url: '/pages/contact' },
            { label: 'S.S.S.', url: '/sss' },
            { label: 'Kendi Turunu Planla', url: '/kendi-turunu-planla', isCta: true },
        ]);

        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Layout Classes Calculation
    const headerClasses = isHome
        ? scrolled
            ? 'fixed top-4 left-0 right-0 z-50 transition-all duration-300 container mx-auto rounded-full bg-white shadow-lg py-2 md:py-3 px-6 md:px-8 flex flex-row items-center justify-between' // Home Scrolled: Floating Pill
            : 'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent py-4 md:py-6 flex flex-col items-center gap-4' // Home Initial: Transparent Stacked
        : 'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-md py-2 md:py-3 flex flex-row items-center justify-between px-6 md:px-8'; // Others: Fixed White Row

    const logoClasses = isHome
        ? scrolled
            ? 'h-10 md:h-12 w-auto' // Home Scrolled
            : 'h-20 w-auto' // Home Initial
        : 'h-10 md:h-12 w-auto'; // Others

    const menuContainerClasses = isHome && !scrolled
        ? 'hidden md:flex flex-row items-center gap-2' // Home Initial - Added hidden md:flex
        : 'hidden md:flex flex-row items-center gap-1'; // Others & Home Scrolled

    const menuItemClasses = (item: any) => {
        const isActive = pathname === item.url;
        const base = "px-3 md:px-4 py-2 font-bold uppercase text-[11px] md:text-[13px] tracking-wider transition-all rounded-full hover:shadow-lg";

        if (item.isCta) {
            return `${base} bg-[#bda569] text-white hover:bg-[#a38b55] hover:shadow-xl hover:-translate-y-0.5 ml-2`;
        }

        if (isHome && !scrolled) {
            return `${base} text-white bg-black/20 backdrop-blur-sm hover:bg-primary-600 hover:text-white`;
        }

        return `${base} ${isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'}`;
    };

    return (
        <header className={headerClasses}>
            {/* Logo */}
            <Link 
                href="/" 
                className={`flex-shrink-0 transition-all duration-500 z-[60] ${isOpen ? 'fixed top-5 left-6 shadow-sm' : ''}`}
            >
                <img
                    src={
                        (isHome && !scrolled && !isOpen)
                            ? (logoUrl ? (logoUrl.startsWith('http') ? logoUrl : `${process.env.NEXT_PUBLIC_API_URL || ''}${logoUrl}`) : '/logo.png')
                            : (faviconUrl ? (faviconUrl.startsWith('http') ? faviconUrl : `${process.env.NEXT_PUBLIC_API_URL || ''}${faviconUrl}`) : '/favicon.ico')
                    }
                    alt="Site Logo"
                    className={`object-contain transition-all duration-500 ${isOpen ? 'h-10 md:h-12 w-auto' : logoClasses}`}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = (isHome && !scrolled && !isOpen) ? '/logo.png' : '/favicon.ico'; }}
                />
            </Link>

            {/* Desktop Menu */}
            <nav className={menuContainerClasses}>
                {menu.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.url}
                        className={menuItemClasses(item)}
                    >
                        {item.label}
                    </Link>
                ))}

                {/* Language Switcher Desktop */}
                <div className="flex items-center gap-2 ml-4 border-l pl-4 border-gray-300/30">
                    <button onClick={() => handleLanguageChange('tr')} className={`w-6 h-6 rounded-full overflow-hidden border ${currentLang === 'tr' ? 'border-[#bda569] ring-2 ring-[#bda569]/30' : 'border-gray-200 opacity-70 hover:opacity-100'} transition-all`}>
                        <img src="https://flagcdn.com/w40/tr.png" alt="Türkçe" className="w-full h-full object-cover" />
                    </button>
                    <button onClick={() => handleLanguageChange('en')} className={`w-6 h-6 rounded-full overflow-hidden border ${currentLang === 'en' ? 'border-[#bda569] ring-2 ring-[#bda569]/30' : 'border-gray-200 opacity-70 hover:opacity-100'} transition-all`}>
                        <img src="https://flagcdn.com/w40/gb.png" alt="English" className="w-full h-full object-cover" />
                    </button>
                    <button onClick={() => handleLanguageChange('ar')} className={`w-6 h-6 rounded-full overflow-hidden border ${currentLang === 'ar' ? 'border-[#bda569] ring-2 ring-[#bda569]/30' : 'border-gray-200 opacity-70 hover:opacity-100'} transition-all`}>
                        <img src="https://flagcdn.com/w40/sa.png" alt="Arabic" className="w-full h-full object-cover" />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
                className={`md:hidden p-2 rounded-xl z-[60] transition-all duration-300 ${isOpen ? 'fixed top-4 right-6 bg-gray-50 text-gray-800 shadow-sm' : 
                    ((isHome && !scrolled) ? 'text-white absolute right-4 top-4' : 'text-gray-800')
                }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={28} /> : <Menu size={32} />}
            </button>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-50 bg-[#bda569] flex flex-col transition-all duration-500 md:hidden ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
                {/* Fixed Top Bar in Menu */}
                <div className="flex justify-between items-center px-6 py-6 border-b border-white/10 shrink-0">
                    <div className="max-w-[180px] overflow-hidden">
                        {logoUrl ? (
                            <img 
                                src={logoUrl.startsWith('http') ? logoUrl : `${process.env.NEXT_PUBLIC_API_URL || ''}${logoUrl}`} 
                                className="h-10 object-contain brightness-0 invert" 
                                alt="Kasrı Royal" 
                            />
                        ) : (
                            <span className="font-bold text-xl text-white uppercase tracking-tighter">Kasrı Royal</span>
                        )}
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="bg-white/10 p-2 rounded-full text-white backdrop-blur-md"
                    >
                        <X size={28} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-10 px-6">
                    <ul className="space-y-4">
                        {menu.map((item: any, idx: number) => (
                            <li key={idx}>
                                <Link
                                    href={item.url}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                                        pathname === item.url 
                                            ? 'bg-white/10 text-white' 
                                            : item.isCta 
                                                ? 'bg-white text-[#bda569] font-black' 
                                                : 'text-white/90 hover:bg-white/5'
                                    }`}
                                >
                                    <span className="text-xl font-bold uppercase tracking-wide">
                                        {item.label}
                                    </span>
                                    <Menu size={20} className="opacity-40" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="mt-auto w-full p-8 border-t border-white/10 bg-black/5">
                    <p className="text-center text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-4">Dil Seçimi / Language</p>
                    <div className="flex items-center justify-center gap-8">
                        <button onClick={() => handleLanguageChange('tr')} className={`group flex flex-col items-center gap-2 transition-all ${currentLang === 'tr' ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-70'}`}>
                            <div className={`w-12 h-12 rounded-2xl overflow-hidden border-2 p-0.5 ${currentLang === 'tr' ? 'border-white' : 'border-transparent'}`}>
                                <img src="https://flagcdn.com/w80/tr.png" alt="Türkçe" className="w-full h-full object-cover rounded-xl" />
                            </div>
                        </button>
                        <button onClick={() => handleLanguageChange('en')} className={`group flex flex-col items-center gap-2 transition-all ${currentLang === 'en' ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-70'}`}>
                            <div className={`w-12 h-12 rounded-2xl overflow-hidden border-2 p-0.5 ${currentLang === 'en' ? 'border-white' : 'border-transparent'}`}>
                                <img src="https://flagcdn.com/w80/gb.png" alt="English" className="w-full h-full object-cover rounded-xl" />
                            </div>
                        </button>
                        <button onClick={() => handleLanguageChange('ar')} className={`group flex flex-col items-center gap-2 transition-all ${currentLang === 'ar' ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-70'}`}>
                            <div className={`w-12 h-12 rounded-2xl overflow-hidden border-2 p-0.5 ${currentLang === 'ar' ? 'border-white' : 'border-transparent'}`}>
                                <img src="https://flagcdn.com/w80/sa.png" alt="Arabic" className="w-full h-full object-cover rounded-xl" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
