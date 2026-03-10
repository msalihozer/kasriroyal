"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '../../../components/ui/DataTable';
import { Plus } from 'lucide-react';

export default function HotelsPage() {
    const router = useRouter();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:4000/api/hotels?status=all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setHotels(data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (hotel: any) => {
        router.push(`/hotels/${hotel.id}`);
    };

    const handleDelete = async (hotel: any) => {
        if (!confirm('Bu oteli silmek istediğinizden emin misiniz?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:4000/api/hotels/${hotel.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchHotels();
            }
        } catch (err) {
            alert('Silme işlemi başarısız');
        }
    };

    const columns = [
        { key: 'title', label: 'Otel Adı', sortable: true },
        {
            key: 'location',
            label: 'Lokasyon',
            render: (_: any, row: any) => row.location?.name || row.city || '-'
        },
        { key: 'stars', label: 'Yıldız', sortable: true },
        {
            key: 'status',
            label: 'Durum',
            render: (value: string) => (
                <span className={`px-2 py-1 rounded text-xs ${value === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {value === 'published' ? 'Yayında' : 'Taslak'}
                </span>
            )
        },
    ];

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Oteller</h1>
                <button
                    onClick={() => router.push('/hotels/new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Yeni Otel
                </button>
            </div>

            <DataTable
                columns={columns}
                data={hotels}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchPlaceholder="Otel ara..."
            />
        </div>
    );
}
