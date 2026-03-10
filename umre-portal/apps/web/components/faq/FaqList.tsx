"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FaqItem {
    id: string;
    question: string;
    answer: string;
    category?: string;
}

export default function FaqList({ faqs }: { faqs: FaqItem[] }) {
    const [openId, setOpenId] = useState<string | null>(null);

    const toggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    if (!faqs || faqs.length === 0) {
        return <div className="text-center py-10 text-gray-500">Henüz eklenmiş soru bulunmuyor.</div>;
    }

    return (
        <div className="space-y-4">
            {faqs.map((faq) => (
                <div
                    key={faq.id}
                    className={`border rounded-xl overflow-hidden transition-all duration-300 ${openId === faq.id ? 'border-[#bda569] shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                >
                    <button
                        onClick={() => toggle(faq.id)}
                        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${openId === faq.id ? 'bg-[#bda569] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                <HelpCircle size={16} />
                            </div>
                            <span className={`font-bold text-lg ${openId === faq.id ? 'text-[#bda569]' : 'text-gray-800'}`}>
                                {faq.question}
                            </span>
                        </div>
                        {openId === faq.id ?
                            <ChevronUp className="text-[#bda569]" /> :
                            <ChevronDown className="text-gray-400" />
                        }
                    </button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                            {faq.answer}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
