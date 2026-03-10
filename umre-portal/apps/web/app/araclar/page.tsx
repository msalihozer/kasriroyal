import Link from 'next/link';

async function getVehicles() {
    try {
        const res = await fetch('http://localhost:4000/api/vehicles?status=published', {
            cache: 'no-store'
        });
        if (res.ok) {
            const data = await res.json();
            return data || [];
        }
    } catch (err) {
        console.error(err);
    }
    return [];
}

export default async function VehiclesPage() {
    const vehicles = await getVehicles();

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">Transfer Araçlarımız</h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl">
                Umre ve Hac ibadetlerinizde, havalimanı transferleri ve şehir içi ulaşımınız için son model, konforlu araçlarımızla hizmetinizdeyiz.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {vehicles.map((vehicle: any) => (
                    <div key={vehicle.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
                        {vehicle.imageUrl ? (
                            <img
                                src={vehicle.imageUrl}
                                alt={vehicle.modelName}
                                className="w-full h-56 object-cover"
                            />
                        ) : (
                            <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-400">
                                Görsel Yok
                            </div>
                        )}
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-xl text-gray-900">{vehicle.modelName}</h3>
                                {vehicle.capacity && (
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                                        {vehicle.capacity} Kişilik
                                    </span>
                                )}
                            </div>

                            {vehicle.description && (
                                <div
                                    className="text-gray-600 text-sm mb-4 line-clamp-3 prose prose-sm"
                                    dangerouslySetInnerHTML={{ __html: vehicle.description }}
                                />
                            )}

                            {vehicle.features && vehicle.features.length > 0 && (
                                <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs font-semibold text-gray-500 uppercase">Özellikler</p>
                                    <ul className="flex flex-wrap gap-2">
                                        {vehicle.features.map((feature: string, idx: number) => (
                                            <li key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {vehicles.length === 0 && (
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 text-lg">Henüz transfer aracı eklenmemiştir.</p>
                </div>
            )}
        </div>
    );
}
