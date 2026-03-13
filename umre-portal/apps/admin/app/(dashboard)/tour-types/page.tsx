"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '../../../components/ui/DataTable';
import { Plus, Edit, Trash } from 'lucide-react';

export default function TourTypesPage() {
    const router = useRouter();
    const [tourTypes, setTourTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingType, setEditingType] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', slug: '' });

    useEffect(() => {
        fetchTourTypes();
    }, []);

    const fetchTourTypes = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/tour-types`);
            if (res.ok) {
                const data = await res.json();
                setTourTypes(data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = editingType
                ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/tour-types/${editingType.id}`
                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/tour-types`;

            const method = editingType ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchTourTypes();
                closeModal();
            } else {
                alert('Kaydetme başarısız');
            }
        } catch (err) {
            alert('Bir hata oluştu');
        }
    };

    const handleDelete = async (type: any) => {
        if (!confirm('Bu tur tipini silmek istediğinizden emin misiniz?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/tour-types/${type.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchTourTypes();
            }
        } catch (err) {
            alert('Silme işlemi başarısız');
        }
    };

    const openModal = (type: any = null) => {
        if (type) {
            setEditingType(type);
            setFormData({ name: type.name, slug: type.slug });
        } else {
            setEditingType(null);
            setFormData({ name: '', slug: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingType(null);
        setFormData({ name: '', slug: '' });
    };

    const columns = [
        { key: 'name', label: 'Tur Tipi', sortable: true },
        { key: 'slug', label: 'Slug', sortable: true },
        {
            key: 'actions',
            label: 'İşlemler',
            render: (_: any, item: any) => (
                <div className="flex gap-2">
                    <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-800"><Trash size={18} /></button>
                </div>
            )
        }
    ];

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Tur Tipleri</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Yeni Tur Tipi
                </button>
            </div>

            <DataTable
                columns={columns}
                data={tourTypes}
                searchPlaceholder="Tur tipi ara..."
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{editingType ? 'Tur Tipi Düzenle' : 'Yeni Tur Tipi'}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Ad</label>
                                <input
                                    type="text"
                                    className="w-full border rounded p-2"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Slug</label>
                                <input
                                    type="text"
                                    className="w-full border rounded p-2"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">İptal</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
