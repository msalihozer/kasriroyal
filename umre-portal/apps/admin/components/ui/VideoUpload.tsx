"use client";
import { useState, useRef } from 'react';
import { Upload, X, Video as VideoIcon } from 'lucide-react';

interface VideoUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function VideoUpload({ value, onChange, label = "Video Yükle" }: VideoUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            alert('Lütfen geçerli bir video dosyası seçin (MP4, WEBM vb.)');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:4000/api/media/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                const videoUrl = data.url;
                setPreview(videoUrl);
                onChange(videoUrl);
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
                <div className="relative inline-block w-full max-w-md">
                    <video
                        src={preview.startsWith('http') ? preview : `http://localhost:4000${preview}`}
                        controls
                        className="w-full rounded-lg border bg-black"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                    >
                        <X size={16} />
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">{preview}</p>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full max-w-md h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                >
                    {uploading ? (
                        <div className="text-gray-500">Video Yükleniyor...</div>
                    ) : (
                        <>
                            <VideoIcon size={32} className="text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Video seçin (MP4)</span>
                        </>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
