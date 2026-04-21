"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '../../../components/ui/DataTable';
import ImageUpload from '../../../components/ui/ImageUpload';
import { Plus, Edit, Trash } from 'lucide-react';
import { getImageUrl } from '../../../utils/image-url';

export default function LocationsPage() {
    const router = useRouter();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', slug: '', imageUrl: '' });


    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/locations`);
            if (res.ok) {
                const data = await res.json();
                setLocations(data || []);
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
            const url = editingLocation
                ? `${process.env.NEXT_PUBLIC_API_URL || ''}/api/locations/${editingLocation.id}`
                : `${process.env.NEXT_PUBLIC_API_URL || ''}/api/locations`;

            const method = editingLocation ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchLocations();
                closeModal();
            } else {
                const errorData = await res.json();
                alert(`Kaydetme başarısız: ${errorData.message || 'Bilinmeyen hata'}`);
            }
        } catch (err) {
            alert('Bir hata oluştu. Lütfen bağlantınızı kontrol edin.');
        }
    };

    const handleDelete = async (location: any) => {
        if (!confirm('Bu lokasyonu silmek istediğinizden emin misiniz?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/locations/${location.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchLocations();
            }
        } catch (err) {
            alert('Silme işlemi başarısız');
        }
    };

    const openModal = (location: any = null) => {
        if (location) {
            setEditingLocation(location);
            setFormData({ name: location.name, slug: location.slug, imageUrl: location.imageUrl || '' });
        } else {
            setEditingLocation(null);
            setFormData({ name: '', slug: '', imageUrl: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLocation(null);
        setFormData({ name: '', slug: '', imageUrl: '' });
    };

    const columns = [
        {
            key: 'imageUrl',
            label: 'Görsel',
            render: (val: string) => val ? <img src={getImageUrl(val)} alt="Loc" className="w-10 h-10 object-cover rounded" /> : <div className="w-10 h-10 bg-gray-200 rounded"></div>
        },
        { key: 'name', label: 'Lokasyon Adı', sortable: true },
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
                <h1 className="text-3xl font-bold">Lokasyonlar</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Yeni Lokasyon
                </button>
            </div>

            <DataTable
                columns={columns}
                data={locations}
                searchPlaceholder="Lokasyon ara..."
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">{editingLocation ? 'Lokasyon Düzenle' : 'Yeni Lokasyon'}</h2>
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
                            <ImageUpload
                                value={formData.imageUrl}
                                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                                label="Kapak Görseli"
                            />
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
