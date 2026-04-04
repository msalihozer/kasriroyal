"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Maximize, Crop } from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label = "Resim Yükle" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value || '');
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState(16 / 9);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Helper to get full URL
    const getFullUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        return `${process.env.NEXT_PUBLIC_API_URL || ''}${url}`;
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

        const reader = new FileReader();
        reader.onload = () => {
            setImageToCrop(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveCrop = async () => {
        if (!imageToCrop || !croppedAreaPixels) return;

        setUploading(true);
        try {
            const croppedImageBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
            if (!croppedImageBlob) throw new Error("Kırpma başarısız");

            const uploadFile = new File([croppedImageBlob], "cropped-image.jpg", { type: "image/jpeg" });
            const formData = new FormData();
            formData.append('file', uploadFile);

            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/media/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                onChange(data.url);
                setPreview(getFullUrl(data.url));
                setImageToCrop(null);
            } else {
                alert('Yükleme başarısız');
            }
        } catch (err) {
            console.error(err);
            alert('Kırpma veya yükleme sırasında hata oluştu');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemove = () => {
        setPreview('');
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const aspectRatios = [
        { label: '16:9', value: 16 / 9 },
        { label: '4:3', value: 4 / 3 },
        { label: '1:1', value: 1 / 1 },
        { label: 'Serbest', value: undefined },
    ];

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            {preview ? (
                <div className="relative inline-block group">
                    {preview.match(/\.(mp4|webm|ogg)$/i) ? (
                        <div className="w-64 h-40 bg-gray-100 rounded-lg border flex flex-col items-center justify-center text-gray-500">
                            <span className="text-xs p-2 text-center break-all text-gray-400 font-mono">Video Yüklendi</span>
                        </div>
                    ) : (
                        <div className="relative w-64 h-40 rounded-xl overflow-hidden border shadow-sm group-hover:shadow-md transition-all">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 shadow-lg"
                                    title="Değiştir"
                                >
                                    <Upload size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
                                    title="Kaldır"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all text-gray-400 hover:text-blue-500 group"
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm font-medium">Yükleniyor...</span>
                        </div>
                    ) : (
                        <>
                            <div className="p-3 bg-gray-100 rounded-full group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors mb-2">
                                <ImageIcon size={32} />
                            </div>
                            <span className="text-sm font-bold">Resim Seçin</span>
                            <span className="text-xs opacity-60">veya sürükleyip bırakın</span>
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

            {/* Crop Modal */}
            {imageToCrop && (
                <div className="fixed inset-0 z-[9999] flex flex-col bg-black">
                    <div className="flex items-center justify-between p-4 bg-gray-900 text-white z-10 shrink-0">
                        <div className="flex items-center gap-4">
                            <h3 className="font-bold">Resmi Kırp</h3>
                            <div className="flex gap-2">
                                {aspectRatios.map((r) => (
                                    <button
                                        key={r.label}
                                        type="button"
                                        onClick={() => setAspect(r.value || 1)}
                                        className={`px-3 py-1 text-xs rounded-full border transition-all ${aspect === r.value ? 'bg-blue-600 border-blue-600' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}
                                    >
                                        {r.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setImageToCrop(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                            >
                                Vazgeç
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveCrop}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg"
                                disabled={uploading}
                            >
                                {uploading ? 'Yükleniyor...' : 'Kullan ve Yükle'}
                            </button>
                        </div>
                    </div>

                    <div className="relative flex-1 bg-gray-950">
                        <Cropper
                            image={imageToCrop}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>

                    <div className="p-6 bg-gray-900 border-t border-gray-800 text-white shrink-0">
                        <div className="max-w-xs mx-auto">
                            <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-widest text-center">Yakınlaştır : {Math.round(zoom * 100)}%</p>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
