"use client";
import { useEffect, useRef } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    label?: string;
}

export default function RichTextEditor({ value, onChange, label = "İçerik" }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<any>(null);
    const loadedRef = useRef(false);

    const onChangeRef = useRef(onChange);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    // Load Quill from CDN
    useEffect(() => {
        if (loadedRef.current) return;

        const loadQuill = async () => {
            // Load CSS
            if (!document.getElementById('quill-css')) {
                const link = document.createElement('link');
                link.id = 'quill-css';
                link.rel = 'stylesheet';
                link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
                document.head.appendChild(link);
            }

            // Load JS
            if (!window.hasOwnProperty('Quill')) {
                const script = document.createElement('script');
                script.id = 'quill-js';
                script.src = 'https://cdn.quilljs.com/1.3.6/quill.min.js';
                script.onload = () => {
                    initQuill();
                };
                document.body.appendChild(script);
            } else {
                initQuill();
            }
        };

        loadQuill();
        loadedRef.current = true;
    }, []);

    const initQuill = () => {
        if (!editorRef.current || quillRef.current) return;

        // @ts-ignore
        const Quill = window.Quill;

        if (!Quill) return;

        // Add custom fonts to whitelist
        const Font = Quill.import('formats/font');
        Font.whitelist = ['mirza', 'roboto', 'sofia', 'slabo', 'inconsolata', 'ubuntu'];
        Quill.register(Font, true);

        // Toolbar Options
        const toolbarOptions = [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
            ['bold', 'italic', 'underline', 'strike'],        // toggles
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']                                         // remove formatting button
        ];

        quillRef.current = new Quill(editorRef.current, {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions
            }
        });

        // Set initial value
        if (value) {
            quillRef.current.clipboard.dangerouslyPasteHTML(value);
        }

        // Handle changes
        quillRef.current.on('text-change', () => {
            const html = editorRef.current?.querySelector('.ql-editor')?.innerHTML;
            onChangeRef.current(html || '');
        });
    };

    // Update value if changed externally (e.g. when post data is loaded)
    useEffect(() => {
        if (quillRef.current && typeof value === 'string') {
            const currentHtml = quillRef.current.root.innerHTML;
            // Only update if current editor content is fundamentally different from incoming value
            // and avoid updating if editor is just "empty" and value is empty
            if (value !== currentHtml) {
                // If the editor is empty (or just has a break) and we have new value, or if it's a completely different content
                if (currentHtml === '<p><br></p>' || (value.length > 0 && !currentHtml.includes(value.substring(0, 20)))) {
                    quillRef.current.clipboard.dangerouslyPasteHTML(value);
                }
            }
        }
    }, [value]);

    return (
        <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div ref={editorRef} style={{ minHeight: '300px', backgroundColor: 'white' }} className="rounded-b-lg" />
            </div>
            <style jsx global>{`
                .ql-toolbar {
                    border-top-left-radius: 0.5rem;
                    border-top-right-radius: 0.5rem;
                    background-color: #f8fafc;
                    border-color: #e2e8f0 !important;
                }
                .ql-container {
                    border-bottom-left-radius: 0.5rem;
                    border-bottom-right-radius: 0.5rem;
                    border-color: #e2e8f0 !important;
                    font-family: inherit;
                    font-size: 1rem;
                }
                .ql-editor {
                    min-height: 300px;
                }
            `}</style>
        </div>
    );
}
