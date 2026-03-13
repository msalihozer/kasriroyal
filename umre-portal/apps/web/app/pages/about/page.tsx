import { Building, CreditCard, User, MapPin, Target, Eye } from 'lucide-react';

async function getSettings() {
    try {
        const res = await fetch(`${process.env.API_BASE_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api`}/site-settings`, { cache: 'no-store' });
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        return null;
    }
}

export default async function AboutPage() {
    const settings = await getSettings();
    const bankAccounts = Array.isArray(settings?.bankAccounts) ? settings.bankAccounts : [];

    return (
        <main className="min-h-screen bg-white pb-20">
            {/* Header */}
            <div className="bg-black text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/ottoman_tile_pattern_dark.png')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 uppercase !text-white drop-shadow-lg">Hakkımızda</h1>
                    <p className="!text-white text-lg max-w-2xl mx-auto drop-shadow-md">
                        Misyonumuz, vizyonumuz ve kurumsal değerlerimiz.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    {/* Mission */}
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-shadow">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <Target size={32} />
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Misyonumuz</h2>
                            {settings?.mission ? (
                                <div
                                    className="prose prose-blue text-gray-600 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: settings.mission }}
                                />
                            ) : (
                                <p className="text-gray-400 italic">Henüz misyon bilgisi eklenmemiş.</p>
                            )}
                        </div>
                    </div>

                    {/* Vision */}
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-shadow">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-bl-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                                <Eye size={32} />
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Vizyonumuz</h2>
                            {settings?.vision ? (
                                <div
                                    className="prose prose-purple text-gray-600 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: settings.vision }}
                                />
                            ) : (
                                <p className="text-gray-400 italic">Henüz vizyon bilgisi eklenmemiş.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bank Accounts */}
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-3">Banka Hesap Bilgilerimiz</h2>
                        <p className="text-gray-500">Ödemeleriniz için resmi banka hesaplarımızı kullanabilirsiniz.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {bankAccounts.length > 0 ? (
                            bankAccounts.map((account: any, index: number) => (
                                <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:border-[#bda569] transition-colors relative overflow-hidden">
                                    <div className="float-right text-gray-100 -mt-2 -mr-2">
                                        <Building size={80} />
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold text-gray-800 mb-1">{account.bankName}</h3>
                                        <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                                            <MapPin size={14} /> {account.branch}
                                        </p>

                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Hesap Sahibi</p>
                                                <p className="font-medium text-gray-700 flex items-center gap-2">
                                                    <User size={16} className="text-[#bda569]" />
                                                    {account.accountHolder}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">IBAN</p>
                                                <p className="font-mono font-bold text-gray-800 text-lg break-all flex items-start gap-2">
                                                    <CreditCard size={20} className="text-[#bda569] mt-1 shrink-0" />
                                                    {account.iban}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">Henüz banka hesap bilgisi eklenmemiş.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </main>
    );
}
