"use client";

import { useState, useEffect } from 'react';
import { Loader2, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Reservation {
    id: string;
    name: string;
    phone: string;
    email: string;
    city: string;
    personCount: number;
    tourName: string;
    note: string;
    status: string;
    createdAt: string;
}

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/reservations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setReservations(data);
            }
        } catch (error) {
            console.error('Failed to fetch reservations');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/reservations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setReservations(reservations.map(r => r.id === id ? { ...r, status: newStatus } : r));
            }
        } catch (error) {
            alert('Güncelleme başarısız');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu başvuruyu silmek istediğinize emin misiniz?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/reservations/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setReservations(reservations.filter(r => r.id !== id));
            }
        } catch (error) {
            alert('Silme işlemi başarısız');
        }
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                <Phone className="text-blue-600" /> Başvurular
            </h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Müşteri Bilgileri</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">İlgilendiği Tur</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Yolcu</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tarih</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {reservations.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-gray-400 italic">Henüz başvuru bulunmuyor.</td>
                            </tr>
                        ) : (
                            reservations.map((res) => (
                                <tr key={res.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{res.name}</span>
                                            <div className="flex items-center gap-3 mt-1">
                                                <a href={`tel:${res.phone}`} className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1">
                                                    <Phone size={10} /> {res.phone}
                                                </a>
                                                {res.email && (
                                                    <a href={`mailto:${res.email}`} className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1">
                                                        <Mail size={10} /> {res.email}
                                                    </a>
                                                )}
                                            </div>
                                            {res.city && (
                                                <span className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                                                    <MapPin size={10} /> {res.city}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="max-w-[200px]">
                                            <div className="font-semibold text-sm text-blue-600 truncate" title={res.tourName}>
                                                {res.tourName || 'Genel Başvuru'}
                                            </div>
                                            {res.note && (
                                                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 italic" title={res.note}>
                                                    "{res.note}"
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-bold tracking-tight">
                                            {res.personCount} Kişi
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-700">{format(new Date(res.createdAt), 'dd MMMM yyyy', { locale: tr })}</span>
                                            <span className="text-[10px] text-gray-400">{format(new Date(res.createdAt), 'HH:mm')}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={res.status}
                                            onChange={(e) => updateStatus(res.id, e.target.value)}
                                            className={`text-[11px] font-bold border rounded-full px-3 py-1 outline-none transition-all cursor-pointer ${
                                                res.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                res.status === 'contacted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                res.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                'bg-rose-50 text-rose-700 border-rose-200'
                                            }`}
                                        >
                                            <option value="pending">⏳ Bekliyor</option>
                                            <option value="contacted">📞 Arandı</option>
                                            <option value="completed">✅ Tamamlandı</option>
                                            <option value="cancelled">❌ İptal</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDelete(res.id)}
                                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                            title="Sil"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
