"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

export default function FaqSection() {
    const [faqs, setFaqs] = useState<FaqItem[]>([]);
    const [openId, setOpenId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/faq`);
                if (res.ok) {
                    const data = await res.json();
                    // Take only first 4 items
                    setFaqs(data.slice(0, 4));
                }
            } catch (error) {
                console.error('Failed to fetch FAQs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    const toggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    if (loading || faqs.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <HelpCircle size={32} />
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                        Sıkça Sorulan Sorular
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Umre ibadeti ve turlarımız hakkında merak edilen soruların cevaplarını burada bulabilirsiniz.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4 mb-10">
                    {faqs.map((faq) => (
                        <div
                            key={faq.id}
                            className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${openId === faq.id ? 'border-[#bda569] shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <button
                                onClick={() => toggle(faq.id)}
                                className="w-full flex items-center justify-between p-5 text-left transition-colors"
                            >
                                <span className={`font-bold text-lg ${openId === faq.id ? 'text-[#bda569]' : 'text-gray-800'}`}>
                                    {faq.question}
                                </span>
                                {openId === faq.id ?
                                    <ChevronUp className="text-[#bda569]" /> :
                                    <ChevronDown className="text-gray-400" />
                                }
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-100">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/sss"
                        className="inline-flex items-center gap-2 bg-[#bda569] text-white px-8 py-3 rounded-full font-bold hover:bg-[#a38b55] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        Tüm Sıkça Sorulan Sorular
                        <ChevronRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
