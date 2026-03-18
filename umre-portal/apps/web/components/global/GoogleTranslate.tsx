"use client";
import React, { useEffect } from 'react';

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: any;
    }
}

export default function GoogleTranslate() {
    useEffect(() => {
        // Define the initialization function globally
        window.googleTranslateElementInit = () => {
            if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'tr',
                        includedLanguages: 'en,ar,de,fr,ru,tr,fa',
                        autoDisplay: false,
                    },
                    'google_translate_element'
                );
            }
        };

        // Inject script only once
        if (!document.querySelector('#google-translate-script')) {
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.head.appendChild(script);
        }

        // Banner cleanup observer
        const removeBanner = () => {
            const banners = document.querySelectorAll('.goog-te-banner-frame, .skiptranslate');
            banners.forEach((el) => {
                (el as HTMLElement).style.display = 'none';
            });
            if (document.body.style.top && document.body.style.top !== '0px') {
                document.body.style.top = '0px';
            }
        };

        const observer = new MutationObserver(removeBanner);
        observer.observe(document.body, { childList: true, subtree: true });
        const interval = setInterval(removeBanner, 1000);

        return () => {
            observer.disconnect();
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            <div id="google_translate_element" style={{ display: 'none', position: 'absolute', top: '-9999px' }}></div>
            <style>{`
                .goog-te-banner-frame,
                .skiptranslate,
                #goog-gt-tt,
                .goog-tooltip,
                .goog-te-balloon-panel {
                    display: none !important;
                    visibility: hidden !important;
                    height: 0 !important;
                }
                body {
                    top: 0px !important;
                    position: static !important;
                }
                .goog-text-highlight {
                    background-color: transparent !important;
                    box-shadow: none !important;
                }
            `}</style>
        </>
    );
}
