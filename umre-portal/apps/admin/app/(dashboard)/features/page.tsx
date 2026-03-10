"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '../../../components/ui/DataTable';
import { Plus, Edit, Trash } from 'lucide-react';

const CATEGORIES = [
    "Konaklama yerinin özellikleri",
    "Oda özellikleri",
    "Spor tesisleri",
    "Yiyecek ve içecekler",
    "Çocuklar için",
    "Resturant"
];

export default function FeaturesPage() {
    const router = useRouter();
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', icon: '', category: CATEGORIES[0] });

    useEffect(() => {
        fetchFeatures();
    }, []);

    const fetchFeatures = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/features');
            if (res.ok) {
                const data = await res.json();
                setFeatures(data || []);
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
            const url = editingFeature
                ? `http://localhost:4000/api/features/${editingFeature.id}`
                : 'http://localhost:4000/api/features';

            const method = editingFeature ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchFeatures();
                closeModal();
            } else {
                alert('Kaydetme başarısız');
            }
        } catch (err) {
            alert('Bir hata oluştu');
        }
    };

    const handleDelete = async (feature: any) => {
        if (!confirm('Bu özelliği silmek istediğinizden emin misiniz?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:4000/api/features/${feature.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchFeatures();
            }
        } catch (err) {
            alert('Silme işlemi başarısız');
        }
    };

    const openModal = (feature: any = null) => {
        if (feature) {
            setEditingFeature(feature);
            setFormData({ name: feature.name, icon: feature.icon || '', category: feature.category || CATEGORIES[0] });
        } else {
            setEditingFeature(null);
            setFormData({ name: '', icon: '', category: CATEGORIES[0] });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFeature(null);
        setFormData({ name: '', icon: '', category: CATEGORIES[0] });
    };

    const columns = [
        { key: 'name', label: 'Özellik Adı', sortable: true },
        { key: 'category', label: 'Kategori', sortable: true },
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
                <h1 className="text-3xl font-bold">Özellikler</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Yeni Özellik
                </button>
            </div>

            <DataTable
                columns={columns}
                data={features}
                searchPlaceholder="Özellik ara..."
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{editingFeature ? 'Özellik Düzenle' : 'Yeni Özellik'}</h2>
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
                                <label className="block text-sm font-medium mb-1">Kategori</label>
                                <select
                                    className="w-full border rounded p-2"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                >
                                    {CATEGORIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
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
