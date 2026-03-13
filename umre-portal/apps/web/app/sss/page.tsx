import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Metadata } from 'next';
import FaqList from '../../components/faq/FaqList';

export const metadata: Metadata = {
    title: 'Sıkça Sorulan Sorular | Royal Umre',
    description: 'Umre turları, vize işlemleri, oteller ve daha fazlası hakkında sıkça sorulan sorulara buradan ulaşabilirsiniz.',
};

async function getFaqs() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || ''}/api`}/faq`, { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        return [];
    }
}

export default async function FaqPage() {
    const faqs = await getFaqs();

    return (
        <main className="bg-gray-50 min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative bg-[#1a0f0f] text-white py-24">
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Sıkça Sorulan Sorular</h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Aklınıza takılan tüm soruların cevaplarını burada bulabilirsiniz.
                        Bulamadığınız sorular için bizimle iletişime geçebilirsiniz.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
                    <FaqList faqs={faqs} />
                </div>
            </div>
        </main>
    );
}
