"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '../../../components/ui/DataTable';
import { Eye, Trash2 } from 'lucide-react';

export default function CustomRequestsPage() {
    const router = useRouter();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/custom-tour-requests`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setRequests(data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleView = (request: any) => {
        router.push(`/custom-requests/${request.id}`);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu talebi silmek istediğinize emin misiniz?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/custom-tour-requests/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                setRequests(requests.filter((r: any) => r.id !== id));
            }
        } catch (err) {
            console.error(err);
            alert('Silme işlemi başarısız.');
        }
    };

    const columns = [
        { 
            key: 'fullName', 
            label: 'Ad Soyad', 
            sortable: true,
            render: (val: string, row: any) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{val}</span>
                    <span className="text-xs text-gray-400">{row.email}</span>
                </div>
            )
        },
        { key: 'phone', label: 'Telefon', sortable: true },
        { 
            key: 'personCount', 
            label: 'Yolcu', 
            render: (val: any, row: any) => (
                <div className="flex items-center gap-2 text-xs">
                    <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">{row.adultCount || row.personCount} Y</span>
                    {row.childCount > 0 && <span className="bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded font-medium">{row.childCount} Ç</span>}
                </div>
            )
        },
        {
            key: 'createdAt',
            label: 'Tarih',
            sortable: true,
            render: (value: string) => (
                <div className="text-xs">
                    <p className="font-medium">{new Date(value).toLocaleDateString('tr-TR')}</p>
                    <p className="text-gray-400">{new Date(value).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Durum',
            render: (value: string) => {
                const colors: any = {
                    pending: 'bg-amber-100 text-amber-700 border-amber-200',
                    processed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                    cancelled: 'bg-rose-100 text-rose-700 border-rose-200'
                };
                const labels: any = {
                    pending: 'Yeni Talep',
                    processed: 'İşlendi',
                    cancelled: 'İptal'
                };
                return (
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${colors[value] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {labels[value] || value}
                    </span>
                );
            }
        },
        {
            key: 'actions',
            label: 'İşlem',
            render: (value: any, row: any) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleView(row)}
                        className="text-indigo-600 hover:text-white hover:bg-indigo-600 bg-indigo-50 p-2 rounded-lg transition-all"
                        title="Detay Görüntüle"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 p-2 rounded-lg transition-all"
                        title="Sil"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Özel Tur Talepleri</h1>
            </div>

            <DataTable
                columns={columns}
                data={requests}
                searchPlaceholder="İsim veya telefon ara..."
            />
        </div>
    );
}
