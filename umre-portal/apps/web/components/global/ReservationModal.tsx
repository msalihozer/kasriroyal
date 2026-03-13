
"use client";

import { useState } from 'react';
import { X, Loader2, Calendar } from 'lucide-react';

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    tourId?: string;
    tourName?: string;
}

export default function ReservationModal({ isOpen, onClose, tourId, tourName }: ReservationModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        city: '',
        personCount: 1,
        note: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/reservations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    tourId,
                    tourName
                })
            });

            if (res.ok) {
                setStatus('success');
                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                    setFormData({ name: '', phone: '', email: '', city: '', personCount: 1, note: '' });
                }, 3000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-6">
                    <h3 className="text-2xl font-serif font-bold text-gray-900">
                        {tourName ? `${tourName} İçin Başvuru` : 'Ön Başvuru Formu'}
                    </h3>
                    <p className="text-gray-500 text-sm mt-2">
                        Bilgilerinizi bırakın, uzman ekibimiz sizi en kısa sürede arasın.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-green-800 mb-2">Başvurunuz Alındı!</h4>
                        <p className="text-gray-600">En kısa sürede sizinle iletişime geçeceğiz.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                            <input
                                type="text"
                                required
                                className="w-full p-3 border rounded-lg focus:ring-[#bda569] focus:border-[#bda569]"
                                placeholder="Adınız Soyadınız"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full p-3 border rounded-lg focus:ring-[#bda569] focus:border-[#bda569]"
                                    placeholder="0555..."
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border rounded-lg focus:ring-[#bda569] focus:border-[#bda569]"
                                    placeholder="İstanbul"
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                                <input
                                    type="email"
                                    className="w-full p-3 border rounded-lg focus:ring-[#bda569] focus:border-[#bda569]"
                                    placeholder="ornek@email.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kişi Sayısı</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    className="w-full p-3 border rounded-lg focus:ring-[#bda569] focus:border-[#bda569]"
                                    value={formData.personCount}
                                    onChange={e => setFormData({ ...formData, personCount: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notunuz</label>
                            <textarea
                                rows={3}
                                className="w-full p-3 border rounded-lg focus:ring-[#bda569] focus:border-[#bda569] resize-none"
                                placeholder="Varsa eklemek istedikleriniz..."
                                value={formData.note}
                                onChange={e => setFormData({ ...formData, note: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full bg-[#bda569] text-white py-3 rounded-lg font-bold hover:bg-[#a38b55] transition-colors flex items-center justify-center gap-2"
                        >
                            {status === 'submitting' ? <Loader2 className="animate-spin" /> : 'Başvuru Yap'}
                        </button>

                        {status === 'error' && (
                            <p className="text-red-500 text-sm text-center">Bir hata oluştu, lütfen tekrar deneyin.</p>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}
