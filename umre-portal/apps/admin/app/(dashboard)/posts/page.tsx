"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '../../../components/ui/DataTable';
import { Plus } from 'lucide-react';

export default function PostsPage() {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/posts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPosts(data.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (post: any) => {
        router.push(`/posts/${post.id}`);
    };

    const handleDelete = async (post: any) => {
        if (!confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/posts/${post.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchPosts();
            }
        } catch (err) {
            alert('Silme işlemi başarısız');
        }
    };

    const columns = [
        { key: 'title', label: 'Başlık', sortable: true },
        {
            key: 'category',
            label: 'Kategori',
            render: (val: any) => val?.name || '-'
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
    ];

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Blog Yazıları</h1>
                <button
                    onClick={() => router.push('/posts/new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Yeni Yazı
                </button>
            </div>

            <DataTable
                columns={columns}
                data={posts}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchPlaceholder="Yazı ara..."
            />
        </div>
    );
}
