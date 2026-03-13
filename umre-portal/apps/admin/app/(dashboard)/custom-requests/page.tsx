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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/custom-tour-requests`, {
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/custom-tour-requests/${id}`, {
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
        { key: 'fullName', label: 'Ad Soyad', sortable: true },
        { key: 'phone', label: 'Telefon', sortable: true },
        { key: 'personCount', label: 'Kişi Sayısı', sortable: true },
        {
            key: 'createdAt',
            label: 'Tarih',
            sortable: true,
            render: (value: string) => new Date(value).toLocaleDateString('tr-TR')
        },
        {
            key: 'status',
            label: 'Durum',
            render: (value: string) => (
                <span className={`px-2 py-1 rounded text-xs ${value === 'pending' ? 'bg-yellow-100 text-yellow-800 text-center inline-block min-w-[60px]' :
                    value === 'processed' ? 'bg-green-100 text-green-800 text-center inline-block min-w-[60px]' :
                        'bg-gray-100 text-gray-800 text-center inline-block min-w-[60px]'
                    }`}>
                    {value === 'pending' ? 'Bekliyor' : value === 'processed' ? 'İşlendi' : value}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'İşlemler',
            render: (value: any, row: any) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleView(row)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1.5 rounded hover:bg-blue-100 transition-colors"
                        title="Detay Görüntüle"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded hover:bg-red-100 transition-colors"
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
