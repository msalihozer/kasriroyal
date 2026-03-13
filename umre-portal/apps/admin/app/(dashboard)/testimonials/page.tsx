"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '../../../components/ui/DataTable';
import { Plus } from 'lucide-react';

export default function TestimonialsPage() {
    const router = useRouter();
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/testimonials`, {
                headers: { 'Authorization': `Bearer ${token}` } // Not strictly guarded in GET but consistent practice
            });
            if (res.ok) {
                const data = await res.json();
                setTestimonials(data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        router.push(`/testimonials/${item.id}`);
    };

    const handleDelete = async (item: any) => {
        if (!confirm('Silmek istediğinizden emin misiniz?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/testimonials/${item.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchTestimonials();
            }
        } catch (err) {
            alert('Silme işlemi başarısız');
        }
    };

    const columns = [
        { key: 'fullName', label: 'İsim', sortable: true },
        {
            key: 'rating',
            label: 'Puan',
            sortable: true,
            render: (val: number) => '★'.repeat(val)
        },
        {
            key: 'isFeatured',
            label: 'Öne Çıkan',
            render: (value: boolean) => (
                <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {value ? 'Evet' : 'Hayır'}
                </span>
            )
        },
    ];

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Müşteri Yorumları</h1>
                <button
                    onClick={() => router.push('/testimonials/new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Yeni Yorum
                </button>
            </div>

            <DataTable
                columns={columns}
                data={testimonials}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchPlaceholder="İsim ara..."
            />
        </div>
    );
}
