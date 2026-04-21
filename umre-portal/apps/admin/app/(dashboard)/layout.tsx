"use client";
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Map, Hotel, Bus, Settings, LogOut, FileImage, Newspaper, MessageSquare, HelpCircle, Home, Star, Phone, Info, Mail, Calendar, ClipboardList } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menu = [
        { label: 'Dashboard', url: '/', icon: LayoutDashboard },
        { label: 'Anasayfa', url: '/pages/home', icon: Home },
        { label: 'VIP Umre', url: '/vip-umre-pages', icon: Star },
        { label: 'Blog', url: '/posts', icon: Newspaper },
        { label: 'Hakkımızda', url: '/pages/about', icon: Info },
        { label: 'Diğer Sayfalar', url: '/pages', icon: FileText },
        { label: 'Turlar', url: '/turlar', icon: Map },
        { label: 'Tur Tipleri', url: '/tour-types', icon: Map },
        { label: 'Oteller', url: '/hotels', icon: Hotel },
        { label: 'Lokasyonlar', url: '/locations', icon: Map },
        { label: 'Otel Özellikleri', url: '/features', icon: Settings },
        { label: 'Transfer', url: '/vehicles', icon: Bus },
        { label: 'Havayolları', url: '/airlines', icon: Bus },
        { label: 'Yorumlar', url: '/comments', icon: MessageSquare },
        { label: 'Başvurular', url: '/reservations', icon: Calendar },
        { label: 'Özel Tur Talepleri', url: '/custom-requests', icon: ClipboardList },
        { label: 'S.S.S.', url: '/faq', icon: HelpCircle },
        { label: 'Site Ayarları', url: '/settings', icon: Settings },
        { label: 'Email Ayarları', url: '/settings/email', icon: Mail },
        { label: 'Medya', url: '/media', icon: FileImage },
    ];

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
                <div className="p-6 text-xl font-bold border-b border-gray-800">Admin Panel</div>
                <nav className="flex-1 p-4 space-y-2">
                    {menu.map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.url}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${pathname === item.url ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button onClick={handleLogout} className="flex items-center space-x-3 text-gray-400 hover:text-white px-4 py-2 w-full text-left">
                        <LogOut size={20} />
                        <span>Çıkış Yap</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
