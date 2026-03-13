import Link from 'next/link';

export default function FeaturedHotels({ data }: { data: { title?: string, items: any[] } }) {
    if (!data.items || data.items.length === 0) return null;

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">{data.title || "Öne Çıkan Oteller"}</h2>
                    <div className="w-24 h-1 bg-primary-500 mx-auto mt-4 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {data.items.map((hotel: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-xl shadow border overflow-hidden group">
                            <div className="h-48 bg-gray-200 relative">
                                <img
                                    src={hotel.imageUrl ? (hotel.imageUrl.startsWith('http') ? hotel.imageUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${hotel.imageUrl}`) : 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23cccccc%22%2F%3E%3C%2Fsvg%3E'}
                                    alt={hotel.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-lg mb-2">{hotel.title}</h3>
                                <div className="flex text-yellow-400 mb-2">
                                    {'★'.repeat(hotel.stars)}
                                    {'☆'.repeat(5 - hotel.stars)}
                                </div>
                                <div className="text-sm text-gray-500 mb-4">{hotel.city}</div>
                                <Link
                                    href={`/oteller`}
                                    className="block w-full text-center border border-primary-600 text-primary-600 py-2 rounded-lg hover:bg-primary-50"
                                >
                                    İncele
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
