"use client";

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('http://localhost:4000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                throw new Error('Gönderim başarısız');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage('Mesajınız gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-serif font-bold text-gray-800 mb-6">Bize Ulaşın</h3>

            <div className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#bda569] focus:ring-1 focus:ring-[#bda569] outline-none transition-colors"
                        placeholder="Adınız Soyadınız"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresi</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#bda569] focus:ring-1 focus:ring-[#bda569] outline-none transition-colors"
                        placeholder="ornek@email.com"
                    />
                </div>

                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Konu</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#bda569] focus:ring-1 focus:ring-[#bda569] outline-none transition-colors"
                        placeholder="Mesajınızın konusu"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Mesajınız</label>
                    <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#bda569] focus:ring-1 focus:ring-[#bda569] outline-none transition-colors resize-none"
                        placeholder="İletmek istediğiniz mesaj..."
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className={`
                            w-full py-4 px-6 rounded-lg font-bold text-white transition-all transform hover:-translate-y-1
                            flex items-center justify-center gap-2
                            ${status === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-[#bda569] hover:bg-[#a38b55]'}
                            disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                        `}
                    >
                        {status === 'loading' ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Gönderiliyor...
                            </>
                        ) : status === 'success' ? (
                            'Mesajınız İletildi ✔'
                        ) : (
                            <>
                                Gönder <Send size={20} />
                            </>
                        )}
                    </button>
                    {status === 'error' && (
                        <p className="text-red-500 text-sm mt-3 text-center">{errorMessage}</p>
                    )}
                </div>
            </div>
        </form>
    );
}
