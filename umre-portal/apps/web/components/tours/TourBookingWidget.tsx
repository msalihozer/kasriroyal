
"use client";

import { useState } from 'react';
import ReservationModal from '@/components/global/ReservationModal';

interface TourBookingWidgetProps {
    tourId: string;
    tourTitle: string;
}

export default function TourBookingWidget({ tourId, tourTitle }: TourBookingWidgetProps) {
    const [isReservationOpen, setIsReservationOpen] = useState(false);

    return (
        <>
            <a
                href={`https://wa.me/905555555555?text=Merhaba, ${tourTitle} turu hakkında bilgi almak istiyorum.`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 text-white text-center py-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md hover:shadow-lg mb-4"
            >
                WhatsApp İle İletişime Geç
            </a>
            <button
                onClick={() => setIsReservationOpen(true)}
                className="block w-full border-2 border-primary-600 text-primary-600 text-center py-3 rounded-xl font-bold hover:bg-primary-50 transition-colors"
            >
                Ön Başvuru Formu
            </button>

            <ReservationModal
                isOpen={isReservationOpen}
                onClose={() => setIsReservationOpen(false)}
                tourId={tourId}
                tourName={tourTitle}
            />
        </>
    );
}
