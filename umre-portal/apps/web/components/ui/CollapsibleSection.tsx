"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
    title: React.ReactNode; // Can be string or element
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
    contentClassName?: string;
}

export default function CollapsibleSection({
    title,
    children,
    defaultOpen = false,
    className = "bg-white rounded-xl shadow-lg overflow-hidden",
    contentClassName = "p-6"
}: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={className}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors text-left"
            >
                <div className="flex-1">
                    {title}
                </div>
                <div className={`p-2 rounded-full bg-gray-100 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} />
                </div>
            </button>

            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className={contentClassName}>
                    {children}
                </div>
            </div>
        </div>
    );
}
