"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Check, X, Phone, Mail, User, Calendar, Plane, Hotel, Car, MessageSquare, Trash2 } from 'lucide-react';

export default function CustomRequestDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequest();
    }, []);

    const fetchRequest = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/custom-tour-requests/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setRequest(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bu talebi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/custom-tour-requests/${params.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                router.push('/custom-requests');
            }
        } catch (err) {
            console.error(err);
            alert('Silme işlemi başarısız');
        }
    };

    const updateStatus = async (status: string) => {
        if (!confirm(`Durumu "${status}" olarak değiştirmek istediğinize emin misiniz?`)) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/custom-tour-requests/${params.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                fetchRequest();
            }
        } catch (err) {
            alert('Güncelleme başarısız');
        }
    };

    if (loading) return <div>Yükleniyor...</div>;
    if (!request) return <div>Talep bulunamadı</div>;

    const DetailCard = ({ title, icon: Icon, children }: any) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                <Icon size={20} className="text-blue-600" />
                <h3 className="font-bold text-gray-800">{title}</h3>
            </div>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );

    const LabelValue = ({ label, value }: { label: string, value: any }) => (
        <div>
            <span className="text-sm text-gray-500 block">{label}</span>
            <span className="font-medium text-gray-900">{value || '-'}</span>
        </div>
    );

    return (
        <div className="pb-20">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                Listeye Dön
            </button>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Talep Detayı</h1>
                    <div className="text-sm text-gray-500">
                        Oluşturulma: {new Date(request.createdAt).toLocaleString('tr-TR')}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'processed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {request.status === 'pending' ? 'Bekliyor' : request.status === 'processed' ? 'İşlendi' : request.status}
                    </span>

                    {request.status === 'pending' && (
                        <button
                            onClick={() => updateStatus('processed')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-sm"
                        >
                            <Check size={18} />
                            İşlendi Olarak İşaretle
                        </button>
                    )}
                    <button
                        onClick={handleDelete}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 flex items-center gap-2 shadow-sm border border-red-100 transition-colors"
                    >
                        <Trash2 size={18} />
                        Talebi Sil
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Kişisel Bilgiler */}
                <DetailCard title="Kişisel Bilgiler" icon={User}>
                    <LabelValue label="Ad Soyad" value={request.fullName} />
                    <LabelValue label="Telefon" value={request.phone} />
                    <LabelValue label="E-posta" value={request.email} />
                    <LabelValue label="Kişi Sayısı" value={request.personCount} />
                </DetailCard>

                {/* Tarihler */}
                <DetailCard title="Tarih & Süre" icon={Calendar}>
                    <LabelValue label="Planlanan Gidiş" value={request.startDate ? new Date(request.startDate).toLocaleDateString('tr-TR') : 'Belirtilmedi'} />
                    <LabelValue label="Mekke Süresi" value={`${request.mekkeDays} Gün`} />
                    <LabelValue label="Medine Süresi" value={`${request.medineDays} Gün`} />
                    <LabelValue label="Toplam Süre" value={`${(request.mekkeDays || 0) + (request.medineDays || 0)} Gün`} />
                </DetailCard>

                {/* Ulaşım */}
                <DetailCard title="Ulaşım" icon={Plane}>
                    <LabelValue label="Havayolu" value={request.airline} />
                    <LabelValue label="Sınıf" value={request.flightClass === 'Economy' ? 'Ekonomi' : 'Business'} />
                    <LabelValue label="Kalkış Yeri" value={request.departureCity} />
                </DetailCard>

                {/* Konaklama */}
                <DetailCard title="Konaklama" icon={Hotel}>
                    <LabelValue label="Seçim Tipi" value={request.hotelChoiceType === 'preference' ? 'Kriter Bazlı' : 'Özel Seçim'} />

                    {request.hotelChoiceType === 'specific' && request.hotelSelection && (
                        <>
                            <div className="mt-2 pt-2 border-t border-gray-100">
                                <span className="text-sm font-semibold text-gray-700 block mb-1">Seçilen Oteller</span>
                                {typeof request.hotelSelection === 'object' ? (
                                    <>
                                        <LabelValue label="Mekke Oteli" value={request.hotelSelection.mekke} />
                                        <LabelValue label="Medine Oteli" value={request.hotelSelection.medine} />
                                    </>
                                ) : (
                                    <span className="text-gray-900">{String(request.hotelSelection)}</span>
                                )}
                            </div>
                        </>
                    )}

                    {request.hotelChoiceType === 'preference' && request.hotelPreference && (
                        <>
                            <LabelValue label="Otel Sınıfı" value={request.hotelPreference.class} />
                            <LabelValue label="Uzaklık" value={request.hotelPreference.distance} />
                            <LabelValue label="Manzara" value={request.hotelPreference.view} />
                        </>
                    )}
                </DetailCard>

                {/* Transfer */}
                <DetailCard title="Transfer" icon={Car}>
                    <LabelValue label="Hizmet Tipi" value={request.transferChoiceType === 'specific' ? 'Özel Araç Seçimi' : (request.transferService === 'VIP' ? 'VIP Transfer' : 'Ekonomik Transfer')} />

                    {request.transferChoiceType === 'specific' && request.vehicleSelection && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                            <LabelValue label="Seçilen Araç" value={typeof request.vehicleSelection === 'object' ? (request.vehicleSelection.modelName || request.vehicleSelection.name) : request.vehicleSelection} />
                        </div>
                    )}
                </DetailCard>

                {/* Ekstralar */}
                <DetailCard title="Ekstralar & Mesaj" icon={MessageSquare}>
                    <LabelValue label="Rehber Hoca" value={request.guideRequested ? 'İstendi' : 'İstenmedi'} />
                    <div className="mt-4 pt-4 border-t">
                        <LabelValue label="Müşteri Mesajı" value={request.message} />
                    </div>
                </DetailCard>
            </div>
        </div>
    );
}
