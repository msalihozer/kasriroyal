"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Kullanıcı daha önce seçim yapmış mı kontrol et
        const consent = localStorage.getItem('cookieConsent');
        
        // Eğer bir seçim (accepted/declined) yapılmadıysa göster
        if (!consent) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        // Reddetse bile bir daha sorma seçeneği için bu tercihi kaydediyoruz
        localStorage.setItem('cookieConsent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[99999] p-4 md:p-6 animate-in slide-in-from-bottom duration-700">
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-8 transition-all hover:shadow-2xl">
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-gray-900 font-bold mb-1 flex items-center justify-center md:justify-start gap-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                        Çerez ve KVKK Bilgilendirmesi
                    </h4>
                    <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                        Deneyiminizi geliştirmek için çerezleri kullanıyoruz. Sitemizi kullanarak 
                        <Link href="/kurumsal/gizlilik-politikasi" className="text-primary-600 font-bold hover:underline mx-1">Çerez Politikası</Link> 
                        ve 
                        <Link href="/kurumsal/kvkk" className="text-primary-600 font-bold hover:underline mx-1">KVKK Aydınlatma Metni</Link> 
                        şartlarını kabul etmiş sayılırsınız.
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button 
                        onClick={handleDecline}
                        className="px-6 py-2.5 text-xs md:text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Reddet
                    </button>
                    <button 
                        onClick={handleAccept}
                        className="px-8 py-2.5 text-xs md:text-sm font-bold bg-primary-600 text-white rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5"
                    >
                        Kabul Et
                    </button>
                </div>
            </div>
        </div>
    );
}
