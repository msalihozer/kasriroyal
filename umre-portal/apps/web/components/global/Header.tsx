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
            { label: 'Hakkımızda', url: '/pages/about' },
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
            <Link href="/" className="flex-shrink-0 transition-transform duration-300 z-[60]">
                <img
                    src={
                        (isHome && !scrolled && !isOpen)
                            ? (logoUrl ? (logoUrl.startsWith('http') ? logoUrl : `http://localhost:4000${logoUrl}`) : '/logo.png')
                            : (faviconUrl ? (faviconUrl.startsWith('http') ? faviconUrl : `http://localhost:4000${faviconUrl}`) : '/favicon.ico')
                    }
                    alt="Site Logo"
                    className={`object-contain transition-all duration-300 ${isOpen ? 'h-12 w-auto' : logoClasses}`}
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
                className={`md:hidden p-2 rounded-lg z-[60] transition-colors ${isOpen ? 'fixed top-4 right-4 text-gray-800' :
                    ((isHome && !scrolled) ? 'text-white absolute right-4 top-4' : 'text-gray-800')
                    }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-50 bg-white/95 backdrop-blur-lg flex flex-col items-center justify-center transition-all duration-500 md:hidden ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
                <div className="flex flex-col items-center gap-6 w-full max-w-sm px-6">
                    {menu.map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.url}
                            className={`text-2xl font-serif font-bold transition-all duration-300 hover:scale-110 ${item.isCta
                                ? 'bg-[#bda569] text-white px-8 py-3 rounded-full hover:bg-[#a38b55] shadow-lg mt-4 w-full text-center'
                                : (pathname === item.url ? 'text-[#bda569]' : 'text-gray-800 hover:text-[#bda569]')
                                }`}
                            style={{ transitionDelay: `${isOpen ? idx * 50 : 0}ms` }}
                            onClick={() => setIsOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}

                    <div className="flex items-center gap-4 mt-4 p-4 bg-gray-50 rounded-2xl">
                        <button onClick={() => handleLanguageChange('tr')} className={`w-10 h-10 rounded-full overflow-hidden border-2 ${currentLang === 'tr' ? 'border-[#bda569] scale-110' : 'border-gray-200 opacity-70'} transition-all`}>
                            <img src="https://flagcdn.com/w80/tr.png" alt="Türkçe" className="w-full h-full object-cover" />
                        </button>
                        <button onClick={() => handleLanguageChange('en')} className={`w-10 h-10 rounded-full overflow-hidden border-2 ${currentLang === 'en' ? 'border-[#bda569] scale-110' : 'border-gray-200 opacity-70'} transition-all`}>
                            <img src="https://flagcdn.com/w80/gb.png" alt="English" className="w-full h-full object-cover" />
                        </button>
                        <button onClick={() => handleLanguageChange('ar')} className={`w-10 h-10 rounded-full overflow-hidden border-2 ${currentLang === 'ar' ? 'border-[#bda569] scale-110' : 'border-gray-200 opacity-70'} transition-all`}>
                            <img src="https://flagcdn.com/w80/sa.png" alt="Arabic" className="w-full h-full object-cover" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
