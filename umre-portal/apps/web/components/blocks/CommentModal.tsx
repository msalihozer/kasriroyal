"use client";
import React, { useState } from 'react';
import { X, Star, CheckCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CommentModal({ isOpen, onClose }: CommentModalProps) {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [fullName, setFullName] = useState('');
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || ''}/api`;

        try {
            const res = await fetch(`${API_BASE}/testimonials/public`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName,
                    rating,
                    comment,
                    isFeatured: false
                })
            });

            if (res.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    onClose();
                    // Reset after closing
                    setTimeout(() => {
                        setSubmitted(false);
                        setFullName('');
                        setComment('');
                        setRating(5);
                    }, 500);
                }, 2000);
            } else {
                alert('Bir hata oluştu. Lütfen tekrar deneyiniz.');
            }
        } catch (err) {
            console.error(err);
            alert('Bağlantı hatası oluştu.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="p-8">
                                {submitted ? (
                                    <div className="flex flex-col items-center justify-center text-center py-8">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                            <CheckCircle size={32} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Teşekkürler!</h3>
                                        <p className="text-gray-500">
                                            Yorumunuz başarıyla alındı. Yönetici onayından sonra yayınlanacaktır.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">Deneyiminizi Paylaşın</h3>
                                        <p className="text-gray-500 text-sm mb-6">
                                            Hizmetlerimiz hakkındaki düşünceleriniz bizim için çok değerli.
                                        </p>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Puanınız</label>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onMouseEnter={() => setHoverRating(star)}
                                                            onMouseLeave={() => setHoverRating(0)}
                                                            onClick={() => setRating(star)}
                                                            className="focus:outline-none transition-transform hover:scale-110"
                                                        >
                                                            <Star
                                                                size={32}
                                                                fill={(hoverRating || rating) >= star ? "#fbbf24" : "none"}
                                                                className={(hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"}
                                                            />
                                                        </button>
                                                    ))}
                                                    <span className="ml-2 text-lg font-bold text-yellow-500">{rating}.0</span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Adınız Soyadınız</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#bda569] outline-none transition-all"
                                                    placeholder="Adınız Soyadınız"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Yorumunuz</label>
                                                <textarea
                                                    required
                                                    rows={4}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#bda569] outline-none transition-all resize-none"
                                                    placeholder="Deneyiminizi anlatın..."
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-[#bda569] hover:bg-[#a38b55] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {loading ? 'Gönderiliyor...' : 'Yorumu Gönder'}
                                                {!loading && <Send size={18} />}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
