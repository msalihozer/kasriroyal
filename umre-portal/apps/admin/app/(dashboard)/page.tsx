export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Genel Bakış</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Toplam Tur', value: '12' },
                    { label: 'Aktif Rezervasyon', value: '45' },
                    { label: 'Oteller', value: '8' },
                    { label: 'Blog Yazıları', value: '24' },
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
