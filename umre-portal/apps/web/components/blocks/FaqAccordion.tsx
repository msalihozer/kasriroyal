"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FaqAccordion({ data }: { data: { title?: string, items: any[] } }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    if (!data.items || data.items.length === 0) return null;

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl font-bold text-center mb-12">{data.title || "Sıkça Sorulan Sorular"}</h2>
                <div className="space-y-4">
                    {data.items.map((item: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-lg shadow-sm">
                            <button
                                className="w-full px-6 py-4 flex items-center justify-between text-left font-medium"
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            >
                                <span>{item.question}</span>
                                {openIndex === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {openIndex === idx && (
                                <div className="px-6 pb-4 text-gray-600 border-t border-gray-100 pt-2">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
