"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '../../../components/ui/DataTable';
import { Plus, Zap } from 'lucide-react';
import QuickEditTourModal from '../../../components/tours/QuickEditTourModal';

export default function ToursPage() {
    const router = useRouter();
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quickEditTour, setQuickEditTour] = useState<any>(null);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:4000/api/tours?status=all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setTours(data.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (tour: any) => {
        router.push(`/turlar/${tour.id}`);
    };

    const handleQuickEdit = (tour: any) => {
        setQuickEditTour(tour);
    };

    const handleSaveQuickEdit = async (tourId: string, data: any) => {
        try {
            const token = localStorage.getItem('token');
            // Convert date strings to ISO string for backend if needed or send as is if backend handles it.
            // Prisma usually expects ISO-8601 DateTime strings.
            const payload = {
                ...data,
                startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
                endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
                returnDate: data.returnDate ? new Date(data.returnDate).toISOString() : null,
            };

            const res = await fetch(`http://localhost:4000/api/tours/${tourId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                await fetchTours(); // Refresh list
                setQuickEditTour(null);
            } else {
                throw new Error('Update failed');
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const handleDelete = async (tour: any) => {
        if (!confirm('Bu turu silmek istediğinizden emin misiniz?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:4000/api/tours/${tour.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                fetchTours();
            }
        } catch (err) {
            alert('Silme işlemi başarısız');
        }
    };

    const columns = [
        { key: 'title', label: 'Başlık', sortable: true },
        {
            key: 'tourType',
            label: 'Tur Tipi',
            render: (value: any, row: any) => row.tourType?.name || '-'
        },
        { key: 'durationDays', label: 'Gün', sortable: true },
        {
            key: 'priceFrom',
            label: 'Fiyat',
            sortable: true,
            render: (value: any, row: any) => value ? `${value} ${row.currency}` : '-'
        },
        {
            key: 'status',
            label: 'Durum',
            render: (value: string) => (
                <span className={`px-2 py-1 rounded text-xs ${value === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {value === 'published' ? 'Yayında' : 'Taslak'}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Hızlı İşlem',
            render: (value: any, row: any) => (
                <button
                    onClick={() => handleQuickEdit(row)}
                    className="text-orange-600 hover:text-orange-900 bg-orange-50 p-1.5 rounded hover:bg-orange-100 transition-colors"
                    title="Hızlı Düzenle"
                >
                    <Zap size={18} />
                </button>
            )
        }
    ];

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Turlar</h1>
                <button
                    onClick={() => router.push('/turlar/new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Yeni Tur
                </button>
            </div>

            <DataTable
                columns={columns}
                data={tours}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchPlaceholder="Tur ara..."
            />

            {quickEditTour && (
                <QuickEditTourModal
                    isOpen={!!quickEditTour}
                    onClose={() => setQuickEditTour(null)}
                    onSave={handleSaveQuickEdit}
                    tour={quickEditTour}
                />
            )}
        </div>
    );
}
