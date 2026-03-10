"use client";
import CustomTourForm from '../custom-tour/CustomTourForm';

export default function CustomTourBlock({ data }: { data?: any }) {
    return (
        <section className="py-20 bg-gradient-to-b from-[#f8f5e4] via-white to-[#f8f5e4] relative overflow-hidden" id="kendi-turunu-planla">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#bda569]/30 to-transparent"></div>
            <div className="absolute top-10 left-10 w-64 h-64 bg-[#bda569]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-900/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center mb-12 text-center">
                    <span className="text-[#bda569] font-bold tracking-widest text-sm uppercase mb-2">SİZİN İÇİN ÖZEL</span>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6 drop-shadow-sm">
                        {data?.title || "Hayalinizdeki Umreyi Tasarlayın"}
                    </h2>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-[#bda569] to-[#8a7645] rounded-full mb-6"></div>
                    <p className="text-gray-600 mt-2 max-w-2xl text-lg leading-relaxed">
                        Sadece size ve sevdiklerinize özel bir ibadet deneyimi için tarihleri, otelleri ve tüm detayları siz belirleyin. Uzman ekibimiz programınızı hazırlasın.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl shadow-[#bda569]/10 border border-[#bda569]/20 overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
                    <CustomTourForm hotels={[]} vehicles={[]} />
                </div>
            </div>
        </section>
    );
}
