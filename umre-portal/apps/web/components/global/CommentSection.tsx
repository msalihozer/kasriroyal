
"use client";

import { useState, useEffect } from 'react';
import { Star, Send, User } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Comment {
    id: string;
    name: string;
    content: string;
    rating: number;
    createdAt: string;
}

interface CommentSectionProps {
    type: string; // "Page" | "Tour" | "Hotel"
    entityId: string;
    entityName?: string;
}

export default function CommentSection({ type, entityId, entityName }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState({ name: '', content: '', rating: 5 });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    useEffect(() => {
        if (entityId) {
            fetchComments();
        }
    }, [entityId]);

    const fetchComments = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/comments/public?type=${type}&entityId=${entityId}`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error('Yorumlar yüklenemedi');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newComment,
                    type,
                    entityId,
                    entityName
                })
            });

            if (res.ok) {
                setStatus('success');
                setNewComment({ name: '', content: '', rating: 5 });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="bg-gray-50 p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-6">Yorumlar ({comments.length})</h3>

            {/* List */}
            <div className="space-y-4 mb-8">
                {comments.length === 0 ? (
                    <p className="text-gray-500 italic">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm">{comment.name}</div>
                                        <div className="text-xs text-gray-400">
                                            {format(new Date(comment.createdAt), 'dd MMMM yyyy', { locale: tr })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex text-yellow-400 text-xs gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < comment.rating ? "currentColor" : "none"} strokeWidth={i < comment.rating ? 0 : 2} className={i >= comment.rating ? "text-gray-300" : ""} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm">{comment.content}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Form */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-semibold mb-4">Yorum Yap</h4>
                {status === 'success' ? (
                    <div className="bg-green-100 text-green-700 p-4 rounded text-center">
                        Yorumunuz alındı! Onaylandıktan sonra yayınlanacaktır.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">İsim Soyisim</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border rounded text-sm"
                                    value={newComment.name}
                                    onChange={e => setNewComment({ ...newComment, name: e.target.value })}
                                    placeholder="Adınız"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Puan</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setNewComment({ ...newComment, rating: star })}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                size={24}
                                                className={star <= newComment.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Yorumunuz</label>
                            <textarea
                                required
                                rows={3}
                                className="w-full p-2 border rounded text-sm"
                                value={newComment.content}
                                onChange={e => setNewComment({ ...newComment, content: e.target.value })}
                                placeholder="Deneyimlerinizi paylaşın..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="bg-[#bda569] text-white px-6 py-2 rounded hover:bg-[#a38b55] w-full md:w-auto flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {status === 'submitting' ? 'Gönderiliyor...' : <>Yorumu Gönder <Send size={16} /></>}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
