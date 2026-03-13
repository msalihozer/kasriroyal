
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Bekliyor</span>;
            case 'contacted': return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Arandı</span>;
            case 'completed': return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Tamamlandı</span>;
            case 'cancelled': return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">İptal</span>;
            default: return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">{status}</span>;
        }
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Phone /> Başvurular
            </h1>

            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left p-4 text-sm font-semibold text-gray-600">Kişi Bilgileri</th>
                            <th className="text-left p-4 text-sm font-semibold text-gray-600">Tur / Talep</th>
                            <th className="text-left p-4 text-sm font-semibold text-gray-600">Kişi Sayısı</th>
                            <th className="text-left p-4 text-sm font-semibold text-gray-600">Tarih</th>
                            <th className="text-left p-4 text-sm font-semibold text-gray-600">Durum</th>
                            <th className="text-right p-4 text-sm font-semibold text-gray-600">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {reservations.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">Henüz başvuru yok.</td>
                            </tr>
                        ) : (
                            reservations.map((res) => (
                                <tr key={res.id} className="hover:bg-gray-50">
                                    <td className="p-4 align-top">
                                        <div className="font-bold text-gray-900">{res.name}</div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                            <Phone size={12} /> {res.phone}
                                        </div>
                                        {res.email && (
                                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                                <Mail size={12} /> {res.email}
                                            </div>
                                        )}
                                        {res.city && (
                                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                                <MapPin size={12} /> {res.city}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="font-medium text-blue-600">{res.tourName || 'Genel Başvuru'}</div>
                                        {res.note && (
                                            <p className="text-xs text-gray-500 mt-1 italic">"{res.note}"</p>
                                        )}
                                    </td>
                                    <td className="p-4 align-top text-sm">
                                        {res.personCount} Kişi
                                    </td>
                                    <td className="p-4 align-top text-sm text-gray-500 whitespace-nowrap">
                                        {format(new Date(res.createdAt), 'dd MMM HH:mm', { locale: tr })}
                                    </td>
                                    <td className="p-4 align-top">
                                        <select
                                            value={res.status}
                                            onChange={(e) => updateStatus(res.id, e.target.value)}
                                            className="text-xs border rounded p-1"
                                        >
                                            <option value="pending">Bekliyor</option>
                                            <option value="contacted">Arandı</option>
                                            <option value="completed">Tamamlandı</option>
                                            <option value="cancelled">İptal</option>
                                        </select>
                                    </td>
                                    <td className="p-4 align-top text-right">
                                        <button
                                            onClick={() => handleDelete(res.id)}
                                            className="p-1 text-red-500 rounded hover:bg-red-50"
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
