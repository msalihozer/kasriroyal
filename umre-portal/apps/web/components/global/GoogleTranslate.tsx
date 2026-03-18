"use client";
import React, { useEffect, useState } from 'react';

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: any;
    }
}

export default function GoogleTranslate() {
    // Keep track of initialization to avoid double-injection
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Force cleanup of the banner if it appears, but be careful not to kill the engine
        const removeBanner = () => {
            // Instead of removing elements, just hide them and reset body
            const bannerFrame = document.querySelector('.goog-te-banner-frame');
            if (bannerFrame) {
                (bannerFrame as HTMLElement).style.display = 'none';
                (bannerFrame as HTMLElement).style.visibility = 'hidden';
                (bannerFrame as HTMLElement).style.height = '0';
            }

            const iframes = document.getElementsByTagName('iframe');
            for (let i = 0; i < iframes.length; i++) {
                const frame = iframes[i];
                // The banner usually has this id or class
                if (frame.id === ':1.container' || frame.classList.contains('goog-te-banner-frame')) {
                    (frame as HTMLElement).style.display = 'none';
                    (frame as HTMLElement).style.visibility = 'hidden';
                    (frame as HTMLElement).style.height = '0';
                }
            }

            // FORCE RESET BODY - This is the key to fixing the layout shift
            if (document.body.style.top !== '0px') {
                document.body.style.top = '0px';
            }
            if (document.body.style.position === 'relative') {
                document.body.style.position = 'static';
            }
        };

        const observer = new MutationObserver((mutations) => {
            removeBanner();
        });

        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

        // Also run on interval just in case
        const interval = setInterval(removeBanner, 500); // Check every 500ms

        return () => {
            observer.disconnect();
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        // Define the initialization function globally
        window.googleTranslateElementInit = () => {
            if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'tr',
                        includedLanguages: 'en,ar,de,fr,ru,tr,fa', // Add more as needed
                        autoDisplay: false,
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    },
                    'google_translate_element'
                );
            }
        };

        // Create script tag
        if (!document.querySelector('#google-translate-script')) {
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);
        }

        setIsInitialized(true);
    }, []);

    return (
        <>
            <div id="google_translate_element" style={{ display: 'none' }}></div>
            <style jsx global>{`
                /* Hide the Google top bar and all its containers with extreme prejudice */
                .goog-te-banner-frame.skiptranslate, 
                .goog-te-banner-frame, 
                iframe.goog-te-banner-frame,
                .goog-te-menu-frame,
                #goog-gt-tt,
                .goog-tooltip,
                .goog-tooltip:hover,
                .goog-te-balloon-panel,
                .goog-te-spinner-pos,
                .VIpgJd-ZVi9od-ORHb-OEVmcd,
                iframe[id*=".container"] {
                    display: none !important;
                    visibility: hidden !important;
                    height: 0 !important;
                    width: 0 !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                    z-index: -9999 !important;
                    position: absolute !important;
                    top: -9999px !important;
                }
                
                /* Reset body top and margin that Google adds */
                html, body {
                    top: 0px !important;
                    position: static !important;
                    margin-top: 0px !important;
                }

                /* Hide the google branding */
                .goog-logo-link {
                    display: none !important;
                }
                .goog-te-gadget {
                    color: transparent !important;
                    height: 0 !important;
                    overflow: hidden;
                }
                
                /* Ensure no extra space */
                #google_translate_element {
                    display: none !important;
                }
                .goog-text-highlight {
                    background-color: transparent !important;
                    box-shadow: none !important;
                }
            `}</style>
        </>
    );
}
