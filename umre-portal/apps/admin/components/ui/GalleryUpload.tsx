"use client";
import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';

interface GalleryUploadProps {
    value?: string[];
    onChange: (urls: string[]) => void;
    label?: string;
}

export default function GalleryUpload({ value = [], onChange, label = "Galeri Resimleri" }: GalleryUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helper to get full URL
    const getFullUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `http://localhost:4000${url}`;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const newUrls: string[] = [];

        try {
            const token = localStorage.getItem('token');

            // Upload each file
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('file', file);

                const res = await fetch('http://localhost:4000/api/media/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (res.ok) {
                    const data = await res.json();
                    newUrls.push(data.url);
                }
            }

            if (newUrls.length > 0) {
                onChange([...value, ...newUrls]);
            }
        } catch (err) {
            alert('Bir hata oluştu');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = (index: number) => {
        const newValue = [...value];
        newValue.splice(index, 1);
        onChange(newValue);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Existing Images */}
                {value.map((url, index) => (
                    <div key={index} className="relative group aspect-square">
                        <img
                            src={getFullUrl(url)}
                            alt={`Gallery ${index}`}
                            className="w-full h-full object-cover rounded-lg border"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}

                {/* Upload Button */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 hover:bg-gray-100"
                >
                    {uploading ? (
                        <div className="text-gray-500 text-sm">Yükleniyor...</div>
                    ) : (
                        <>
                            <Plus size={32} className="text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500 text-center px-2">Resim Ekle</span>
                        </>
                    )}
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
            />
            <p className="text-xs text-gray-400 mt-2">Birden fazla resim seçebilirsiniz.</p>
        </div>
    );
}
