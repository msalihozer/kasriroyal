"use client";
import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface QuickEditTourModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (tourId: string, data: any) => Promise<void>;
    tour: any;
}

export default function QuickEditTourModal({ isOpen, onClose, onSave, tour }: QuickEditTourModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        startDate: '',
        endDate: '',
        returnDate: '',
        departureLocation: '',
        returnLocation: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (tour) {
            setFormData({
                title: tour.title || '',
                startDate: tour.startDate ? new Date(tour.startDate).toISOString().split('T')[0] : '',
                endDate: tour.endDate ? new Date(tour.endDate).toISOString().split('T')[0] : '',
                returnDate: tour.returnDate ? new Date(tour.returnDate).toISOString().split('T')[0] : '',
                departureLocation: tour.departureLocation || '',
                returnLocation: tour.returnLocation || ''
            });
        }
    }, [tour]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(tour.id, formData);
            onClose();
        } catch (error) {
            console.error('Failed to save tour', error);
            alert('Kaydedilirken bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Hızlı Düzenle</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tur Adı</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gidiş Tarihi</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dönüş Tarihi</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Uçuş Dönüş Tarihi</label>
                        <input
                            type="date"
                            name="returnDate"
                            value={formData.returnDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Otobüs veya uçak varış tarihi farklıysa giriniz.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kalkış Yeri</label>
                            <input
                                type="text"
                                name="departureLocation"
                                value={formData.departureLocation}
                                onChange={handleChange}
                                placeholder="Örn: İstanbul"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Varış Yeri</label>
                            <input
                                type="text"
                                name="returnLocation"
                                value={formData.returnLocation}
                                onChange={handleChange}
                                placeholder="Örn: Cidde"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 result pt-4 border-t mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {saving ? 'Kaydediliyor...' : (
                                <>
                                    <Save size={18} />
                                    Kaydet
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
