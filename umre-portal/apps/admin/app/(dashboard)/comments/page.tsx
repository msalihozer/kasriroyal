
"use client";

import { useState, useEffect } from 'react';
import { Loader2, Trash2, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Comment {
    id: string;
    name: string;
    content: string;
    rating: number;
    type: string;
    entityName: string;
    isPublished: boolean;
    createdAt: string;
}

export default function CommentsPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/comments`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error('Failed to fetch comments');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        if (!confirm(currentStatus ? 'Yorumu yayından kaldırmak istediğinize emin misiniz?' : 'Yorumu yayınlamak istediğinize emin misiniz?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/comments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isPublished: !currentStatus })
            });

            if (res.ok) {
                fetchComments();
            }
        } catch (error) {
            alert('İşlem başarısız');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/comments/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setComments(comments.filter(c => c.id !== id));
            }
        } catch (error) {
            alert('Silme işlemi başarısız');
        }
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare /> Yorumlar
            </h1>

            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left p-4 text-sm font-semibold text-gray-600">Kullanıcı</th>
                            <th className="text-left p-4 text-sm font-semibold text-gray-600">Yorum</th>
                            <th className="text-left p-4 text-sm font-semibold text-gray-600">Yer</th>
                            <th className="text-left p-4 text-sm font-semibold text-gray-600">Tarih</th>
                            <th className="text-left p-4 text-sm font-semibold text-gray-600">Durum</th>
                            <th className="text-right p-4 text-sm font-semibold text-gray-600">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {comments.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">Henüz yorum yok.</td>
                            </tr>
                        ) : (
                            comments.map((comment) => (
                                <tr key={comment.id} className="hover:bg-gray-50">
                                    <td className="p-4 align-top">
                                        <div className="font-medium text-gray-900">{comment.name}</div>
                                        <div className="text-xs text-yellow-500">{'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}</div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <p className="text-sm text-gray-600 line-clamp-3">{comment.content}</p>
                                    </td>
                                    <td className="p-4 align-top text-sm text-gray-500">
                                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{comment.type}</span>
                                        <div className="mt-1">{comment.entityName || '-'}</div>
                                    </td>
                                    <td className="p-4 align-top text-sm text-gray-500 whitespace-nowrap">
                                        {format(new Date(comment.createdAt), 'dd MMM yyyy HH:mm', { locale: tr })}
                                    </td>
                                    <td className="p-4 align-top">
                                        {comment.isPublished ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Yayında
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Onay Bekliyor
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 align-top text-right space-x-2">
                                        <button
                                            onClick={() => toggleStatus(comment.id, comment.isPublished)}
                                            className={`p-1 rounded hover:bg-gray-100 ${comment.isPublished ? 'text-orange-500' : 'text-green-600'}`}
                                            title={comment.isPublished ? 'Yayından Kaldır' : 'Yayınla'}
                                        >
                                            {comment.isPublished ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="p-1 text-red-500 rounded hover:bg-red-50"
                                            title="Sil"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
