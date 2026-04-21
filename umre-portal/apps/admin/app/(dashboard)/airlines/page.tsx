"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '../../../components/ui/DataTable';
import { Plus } from 'lucide-react';
import { getImageUrl } from '../../../utils/image-url';

export default function AirlinesPage() {
    const router = useRouter();
    const [airlines, setAirlines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAirlines();
    }, []);

    const fetchAirlines = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/airlines`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAirlines(data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (airline: any) => {
        router.push(`/airlines/${airline.id}`);
    };

    const handleDelete = async (airline: any) => {
        if (!confirm('Bu havayolu şirketini silmek istediğinizden emin misiniz?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/airlines/${airline.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchAirlines();
            }
        } catch (err) {
            alert('Silme işlemi başarısız');
        }
    };

    const columns = [
        { 
            key: 'logoUrl', 
            label: 'Logo', 
            render: (value: string) => value ? <img src={getImageUrl(value)} className="h-8 w-12 object-contain bg-white p-1 border rounded" /> : <div className="h-8 w-12 bg-gray-100 border rounded flex items-center justify-center text-[10px] text-gray-400">Yok</div>
        },
        { key: 'name', label: 'Şirket Adı', sortable: true },
        { key: 'code', label: 'Kısaltma', sortable: true },
        { 
            key: 'websiteUrl', 
            label: 'Web Sitesi', 
            render: (value: string) => value ? <a href={value} target="_blank" className="text-blue-600 hover:underline text-xs">{value}</a> : '-'
        },
    ];

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Havayolu Şirketleri</h1>
                <button
                    onClick={() => router.push('/airlines/new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Yeni Havayolu
                </button>
            </div>

            <DataTable
                columns={columns}
                data={airlines}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchPlaceholder="Havayolu ara..."
            />
        </div>
    );
}
