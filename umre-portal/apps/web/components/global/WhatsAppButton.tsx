
"use client";

import { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export default function WhatsAppButton() {
    const settings = useSiteSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [showGreeting, setShowGreeting] = useState(false);
    const [message, setMessage] = useState('');

    const whatsappNumber = settings?.socialLinks?.whatsapp || settings?.phone || '';

    useEffect(() => {
        // Show greeting bubble after 3 seconds
        const timer = setTimeout(() => {
            if (!isOpen) setShowGreeting(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, [isOpen]);

    const handleOpen = () => {
        setIsOpen(true);
        setShowGreeting(false);
    };

    const handleSend = () => {
        if (!whatsappNumber) return;

        const currentUrl = window.location.href;
        const finalMessage = `${message}\n\n------------------\n📍 Bu sayfa üzerinden yazıyorum:\n${currentUrl}`;
        const encodedMessage = encodeURIComponent(finalMessage);
        
        window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodedMessage}`, '_blank');
        setIsOpen(false);
        setMessage('');
    };

    if (!whatsappNumber) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            <AnimatePresence>
                {showGreeting && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-white p-4 rounded-2xl shadow-2xl mb-4 border border-green-50 max-w-[200px] relative pointer-events-auto cursor-pointer"
                        onClick={handleOpen}
                    >
                        <p className="text-sm font-medium text-gray-800">
                            Merhaba, size nasıl yardımcı olabiliriz? 😊
                        </p>
                        <div className="absolute bottom-[-8px] right-6 w-4 h-4 bg-white border-b border-r border-green-50 transform rotate-45"></div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setShowGreeting(false); }}
                            className="absolute -top-2 -left-2 bg-gray-100 rounded-full p-1 text-gray-400 hover:text-gray-600 shadow-sm"
                        >
                            <X size={12} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="bg-white w-[320px] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 mb-4"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <MessageCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Royal Umre & Turizm</h3>
                                    <p className="text-[10px] text-green-50 opacity-90">Genellikle anında cevap verir</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="p-4 bg-gray-50/50 min-h-[100px]">
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 mb-4 text-sm text-gray-700">
                                Merhaba! 👋 Size nasıl yardımcı olabiliriz? Sorularınızı buradan sorabilirsiniz.
                            </div>
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-white border-t flex gap-2 items-center">
                            <input 
                                type="text" 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Mesajınızı yazın..."
                                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={!message.trim()}
                                className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:grayscale"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-colors duration-300 ${isOpen ? 'bg-gray-800' : 'bg-green-500 hover:bg-green-600'}`}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </motion.button>
        </div>
    );
}
