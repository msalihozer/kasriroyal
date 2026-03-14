"use client";
import { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import { Users, TrendingUp, Clock, Globe, ShieldAlert, BarChart2 } from 'lucide-react';

interface Stats {
    today: number;
    week: number;
    month: number;
    topPages: { path: string; count: number }[];
    devices: { device: string; count: number }[];
    dailySeries: { date: string; count: number }[];
    avgDuration: number;
}

const DEVICE_COLORS: Record<string, string> = {
    desktop: '#6366f1',
    mobile: '#10b981',
    tablet: '#f59e0b',
    unknown: '#94a3b8',
};

function StatCard({ label, value, icon: Icon, color }: {
    label: string; value: string | number; icon: React.ElementType; color: string;
}) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={22} className="text-white" />
            </div>
            <div>
                <div className="text-gray-500 text-sm">{label}</div>
                <div className="text-2xl font-bold text-gray-800">{value}</div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const [counts, setCounts] = useState({ tours: 0, reservations: 0, hotels: 0, posts: 0 });
    const [analytics, setAnalytics] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

                const [toursRes, reservationsRes, hotelsRes, postsRes, statsRes] = await Promise.all([
                    fetch(`${apiUrl}/api/tours`),
                    fetch(`${apiUrl}/api/reservations`, { headers }),
                    fetch(`${apiUrl}/api/hotels?status=all`),
                    fetch(`${apiUrl}/api/posts?status=all`),
                    fetch(`${apiUrl}/api/analytics/stats`, { headers }),
                ]);

                const [tours, reservations, hotels, posts] = await Promise.all([
                    toursRes.ok ? toursRes.json() : [],
                    reservationsRes.ok ? reservationsRes.json() : [],
                    hotelsRes.ok ? hotelsRes.json() : [],
                    postsRes.ok ? postsRes.json() : [],
                ]);

                setCounts({
                    tours: tours.length || 0,
                    reservations: reservations.length || 0,
                    hotels: hotels.length || 0,
                    posts: posts.length || 0,
                });

                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setAnalytics(statsData);
                }
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) return (
        <div className="p-8 flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
    );

    const formatDuration = (sec: number) => {
        if (sec < 60) return `${sec}sn`;
        return `${Math.floor(sec / 60)}dk ${sec % 60}sn`;
    };

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Genel Bakış</h1>

            {/* İçerik Sayaçları */}
            <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">İçerik</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Toplam Tur', value: counts.tours, icon: Globe, color: 'bg-indigo-500' },
                        { label: 'Rezervasyon', value: counts.reservations, icon: Users, color: 'bg-emerald-500' },
                        { label: 'Oteller', value: counts.hotels, icon: BarChart2, color: 'bg-amber-500' },
                        { label: 'Blog Yazıları', value: counts.posts, icon: TrendingUp, color: 'bg-rose-500' },
                    ].map((s, i) => <StatCard key={i} {...s} />)}
                </div>
            </div>

            {/* Ziyaretçi İstatistikleri */}
            {analytics && (
                <>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Ziyaretçi İstatistikleri</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Bugün" value={analytics.today} icon={Users} color="bg-indigo-500" />
                            <StatCard label="Bu Hafta" value={analytics.week} icon={TrendingUp} color="bg-emerald-500" />
                            <StatCard label="Bu Ay" value={analytics.month} icon={Globe} color="bg-amber-500" />
                            <StatCard label="Ort. Kalma" value={formatDuration(analytics.avgDuration)} icon={Clock} color="bg-rose-500" />
                        </div>
                    </div>

                    {/* Günlük Grafik */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-base font-semibold text-gray-700 mb-4">Son 30 Gün Ziyaret</h2>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={analytics.dailySeries}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={v => v.slice(5)} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={false} name="Ziyaret" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Top Sayfalar */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <TrendingUp size={18} className="text-indigo-500" /> En Çok Ziyaret
                            </h2>
                            <div className="space-y-3">
                                {analytics.topPages.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 truncate max-w-[200px]" title={p.path}>
                                            {p.path || '/'}
                                        </span>
                                        <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                            {p.count}
                                        </span>
                                    </div>
                                ))}
                                {analytics.topPages.length === 0 && (
                                    <p className="text-sm text-gray-400">Henüz veri yok</p>
                                )}
                            </div>
                        </div>

                        {/* Cihaz Dağılımı */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <ShieldAlert size={18} className="text-emerald-500" /> Cihaz Dağılımı
                            </h2>
                            <ResponsiveContainer width="100%" height={150}>
                                <BarChart data={analytics.devices} layout="vertical">
                                    <XAxis type="number" tick={{ fontSize: 11 }} />
                                    <YAxis dataKey="device" type="category" tick={{ fontSize: 12 }} width={60} />
                                    <Tooltip />
                                    <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Ziyaret">
                                        {analytics.devices.map((d, i) => (
                                            <Cell key={i} fill={DEVICE_COLORS[d.device] || '#94a3b8'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
