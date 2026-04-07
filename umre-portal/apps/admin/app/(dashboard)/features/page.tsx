"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '../../../components/ui/DataTable';
import { Plus, Edit, Trash, X, PlusCircle } from 'lucide-react';

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
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [names, setNames] = useState<string[]>(['']);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchFeatures();
    }, []);

    const fetchFeatures = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/features`);
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

    const handleNameChange = (index: number, value: string) => {
        const newNames = [...names];
        newNames[index] = value;
        setNames(newNames);
    };

    const addNameField = () => {
        setNames([...names, '']);
    };

    const removeNameField = (index: number) => {
        if (names.length === 1) return;
        setNames(names.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (index === names.length - 1 && names[index].trim() !== '') {
                addNameField();
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const baseUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/features`;

            if (editingFeature) {
                const res = await fetch(`${baseUrl}/${editingFeature.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ name: names[0], category })
                });
                if (!res.ok) throw new Error('Güncelleme başarısız');
            } else {
                const filteredNames = names.filter(n => n.trim() !== '');
                if (filteredNames.length === 0) {
                    alert('Lütfen en az bir özellik adı girin.');
                    setIsSaving(false);
                    return;
                }

                // Send as array
                const payload = filteredNames.map(name => ({ name: name.trim(), category }));
                const res = await fetch(baseUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
                if (!res.ok) throw new Error('Kaydetme başarısız');
            }

            fetchFeatures();
            closeModal();
        } catch (err) {
            alert('Bir hata oluştu');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (feature: any) => {
        if (!confirm('Bu özelliği silmek istediğinizden emin misiniz?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/features/${feature.id}`, {
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
            setCategory(feature.category || CATEGORIES[0]);
            setNames([feature.name]);
        } else {
            setEditingFeature(null);
            setCategory(CATEGORIES[0]);
            setNames(['']);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFeature(null);
        setNames(['']);
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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Otel Özellikleri</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 flex items-center gap-2 font-bold shadow-sm transition-all"
                >
                    <Plus size={20} />
                    Yeni Özellik Ekle
                </button>
            </div>

            <DataTable
                columns={columns}
                data={features}
                searchPlaceholder="Özellik ara..."
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-black uppercase tracking-tight text-gray-800">
                                {editingFeature ? 'Özellİğİ Düzenle' : 'Yeni Özellİkler Ekle'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        </div>
                        
                        <form onSubmit={handleSave} className="p-8 flex flex-col overflow-hidden">
                            <div className="mb-8">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Kategorİ Seçİmİ</label>
                                <select
                                    className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-700 bg-white focus:border-blue-500 outline-none transition-all"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                >
                                    {CATEGORIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-[100px]">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Özellİk Adları</label>
                                {names.map((name, index) => (
                                    <div key={index} className="flex gap-2 items-center animate-in slide-in-from-left-2 duration-200">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-800 focus:border-blue-500 outline-none transition-all pr-12"
                                                placeholder={`Özellik ${index + 1}`}
                                                value={name}
                                                onChange={(e) => handleNameChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                required
                                                autoFocus={index === names.length - 1 && index > 0}
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 uppercase">{index + 1}</span>
                                        </div>
                                        {!editingFeature && names.length > 1 && (
                                            <button 
                                                type="button" 
                                                onClick={() => removeNameField(index)}
                                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-3 rounded-xl transition-all"
                                            >
                                                <Trash size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {!editingFeature && (
                                <button 
                                    type="button"
                                    onClick={addNameField}
                                    className="mt-6 flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-blue-600 font-black hover:border-blue-200 hover:bg-blue-50 transition-all uppercase tracking-widest text-xs"
                                >
                                    <PlusCircle size={18} />
                                    Bİr Özellİk Daha Ekle
                                </button>
                            )}

                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-50">
                                <button type="button" onClick={closeModal} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl" disabled={isSaving}>İptal</button>
                                <button 
                                    type="submit" 
                                    className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200 hover:scale-[1.02] transition-all" 
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Kaydedİlİyor...' : editingFeature ? 'Güncelle' : 'Hepsİnİ Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
