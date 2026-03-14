"use client";

import { motion } from "framer-motion";

interface VipMinimalHeroProps {
    title: string;
    summary?: string;
    content?: string;
    backgroundImageUrl?: string;
}

import { getImageUrl } from '@/utils/image-url';

export default function VipMinimalHero({ title, summary, content, backgroundImageUrl }: VipMinimalHeroProps) {
    const isDark = !!backgroundImageUrl;

    return (
        <section className={`relative w-full ${isDark ? 'bg-gray-900' : 'bg-[#FAFAFA]'} pt-16 pb-32 md:pt-20 md:pb-36 px-4 flex flex-col items-center justify-center text-center overflow-hidden min-h-[500px]`}>
            {/* Background Decoration OR Image */}
            {backgroundImageUrl ? (
                <>
                    <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-60"
                        style={{ backgroundImage: `url('${encodeURI(getImageUrl(backgroundImageUrl))}')` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent pointer-events-none"></div>
                </>
            ) : (
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[#bda569] blur-[150px]"></div>
                    <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#bda569] blur-[150px]"></div>
                </div>
            )}
            
            <div className="relative z-10 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <span className="block text-[#bda569] text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-4">
                        Royal Umrah Collection
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                    className={`text-3xl md:text-5xl font-serif font-medium ${isDark ? 'text-white' : 'text-gray-900'} leading-tight mb-6 md:mb-8`}
                >
                    {title}
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                    className={`text-base md:text-lg ${isDark ? 'text-gray-300' : 'text-gray-500'} font-light leading-relaxed max-w-2xl mx-auto`}
                >
                    {summary ? (
                        <p>{summary}</p>
                    ) : (
                        <p>Konfor, huzur ve maneviyatı en üst seviyede yaşamanız için size özel hazırlanmış paketlerimizi keşfedin.</p>
                    )}
                </motion.div>

                {content && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className={`mt-6 md:mt-8 prose prose-base md:prose-lg mx-auto ${isDark ? 'prose-invert text-gray-300' : 'prose-gray text-gray-500'}`}
                        dangerouslySetInnerHTML={{ __html: content || '' }}
                    />
                )}
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 ${isDark ? 'text-white/50' : 'text-gray-300'}`}
            >
                <span className="text-xs uppercase tracking-widest">Keşfet</span>
                <div className="w-[1px] h-12 bg-gray-300"></div>
            </motion.div>
        </section>
    );
}
