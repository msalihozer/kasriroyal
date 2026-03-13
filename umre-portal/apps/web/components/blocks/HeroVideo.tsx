export default function HeroVideo({ data }: { data: any }) {
    return (
        <section className="relative h-screen w-full overflow-hidden">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
            >
                {/* Try to load video from data, fallback to placeholder */}
                <source src={data.videoUrl ? (data.videoUrl.startsWith('http') ? data.videoUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${data.videoUrl}`) : "/hero.mp4"} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div className="absolute inset-0 z-20 flex flex-col justify-end items-start px-6 md:px-8 pb-24 md:pb-32 max-w-4xl">
                <h1
                    className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 ml-2 md:ml-4"
                    style={{ color: data.titleColor || '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
                >
                    {data.title}
                </h1>
                <p className="text-base md:text-lg opacity-90 text-white ml-2 md:ml-4 font-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                    {data.subtitle || 'Huzurlu bir yolculuk için...'}
                </p>
            </div>
        </section>
    );
}
