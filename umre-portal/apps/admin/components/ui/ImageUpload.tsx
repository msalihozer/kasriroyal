"use client";
import { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label = "Resim Yükle" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helper to get full URL
    const getFullUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `http://localhost:4000${url}`;
    };

    // Sync with prop change and initial value
    useEffect(() => {
        if (value) {
            setPreview(getFullUrl(value));
        }
    }, [value]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/media/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                onChange(data.url);
            } else {
                alert('Yükleme başarısız');
            }
        } catch (err) {
            alert('Bir hata oluştu');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview('');
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

            {preview ? (
                <div className="relative inline-block">
                    {preview.match(/\.(mp4|webm|ogg)$/i) ? (
                        <div className="w-48 h-48 bg-gray-100 rounded-lg border flex flex-col items-center justify-center text-gray-500">
                            <span className="text-xs p-2 text-center break-all">Video Yüklendi</span>
                        </div>
                    ) : (
                        <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-lg border" />
                    )}
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                >
                    {uploading ? (
                        <div className="text-gray-500">Yükleniyor...</div>
                    ) : (
                        <>
                            <ImageIcon size={48} className="text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Resim seçin</span>
                        </>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
