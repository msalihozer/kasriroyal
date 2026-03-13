"use client";
import { useEffect, useState } from 'react';

export default function DashboardPage() {
    const [stats, setStats] = useState({ tours: 0, reservations: 0, hotels: 0, posts: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const [toursRes, reservationsRes, hotelsRes, postsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/tours`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/reservations`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/hotels?status=all`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/posts?status=all`)
                ]);

                const [tours, reservations, hotels, posts] = await Promise.all([
                    toursRes.ok ? toursRes.json() : [],
                    reservationsRes.ok ? reservationsRes.json() : [],
                    hotelsRes.ok ? hotelsRes.json() : [],
                    postsRes.ok ? postsRes.json() : []
                ]);

                setStats({
                    tours: tours.length || 0,
                    reservations: reservations.length || 0,
                    hotels: hotels.length || 0,
                    posts: posts.length || 0
                });
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Genel Bakış</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Toplam Tur', value: stats.tours },
                    { label: 'Aktif Rezervasyon', value: stats.reservations },
                    { label: 'Oteller', value: stats.hotels },
                    { label: 'Blog Yazıları', value: stats.posts },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="text-gray-500 text-sm mb-1">{stat.label}</div>
                        <div className="text-3xl font-bold">{stat.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
