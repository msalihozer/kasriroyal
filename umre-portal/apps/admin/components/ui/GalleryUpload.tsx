"use client";
import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Plus, Maximize } from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';

interface GalleryUploadProps {
    value?: string[];
    onChange: (urls: string[]) => void;
    label?: string;
    disabledCrop?: boolean;
}

export default function GalleryUpload({ value = [], onChange, label = "Galeri Resimleri", disabledCrop = false }: GalleryUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState(16 / 9);
    const [imageAspect, setImageAspect] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Helper to get full URL
    const getFullUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${process.env.NEXT_PUBLIC_API_URL || ''}${url}`;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (disabledCrop) {
            setUploading(true);
            const newUrls: string[] = [];
            const token = localStorage.getItem('token');

            try {
                for (const file of files) {
                    const formData = new FormData();
                    formData.append('file', file);
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/media/upload`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` },
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
                console.error(err);
                alert('Yükleme sırasında hata oluştu');
            } finally {
                setUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
            return;
        }

        setPendingFiles(files);
        startCropping(files[0]);
    };

    const startCropping = (file: File) => {
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

            const uploadFile = new File([croppedImageBlob], "gallery-image.jpg", { type: "image/jpeg" });
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
                onChange([...value, data.url]);
                
                // Check if there are more files to crop
                const remaining = pendingFiles.slice(1);
                setPendingFiles(remaining);
                if (remaining.length > 0) {
                    startCropping(remaining[0]);
                } else {
                    setImageToCrop(null);
                }
            } else {
                alert('Yükleme başarısız');
                setImageToCrop(null);
            }
        } catch (err) {
            console.error(err);
            alert('Yükleme sırasında bir hata oluştu');
            setImageToCrop(null);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemove = (index: number) => {
        const newValue = [...value];
        newValue.splice(index, 1);
        onChange(newValue);
    };

    const aspectRatios = [
        { label: '16:9', value: 16 / 9 },
        { label: '4:3', value: 4 / 3 },
        { label: '1:1', value: 1 / 1 },
        { label: 'Serbest', value: undefined },
    ];

    const handleSelectAll = () => {
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setAspect(imageAspect);
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
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}

                {/* Upload Button */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all bg-gray-50 hover:bg-blue-50/50 hover:text-blue-500 group"
                >
                    <Plus size={32} className="text-gray-400 group-hover:text-blue-500 mb-2" />
                    <span className="text-sm text-gray-500 group-hover:text-blue-500 font-bold">Resim Ekle</span>
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
            <p className="text-xs text-gray-400 mt-2">Birden fazla resim seçebilirsiniz. Her resim için kırpma penceresi açılacaktır.</p>

            {/* Crop Modal */}
            {imageToCrop && (
                <div className="fixed inset-0 z-[9999] flex flex-col bg-black">
                    <div className="flex items-center justify-between p-4 bg-gray-900 text-white z-10 shrink-0">
                        <div className="flex items-center gap-4">
                            <h3 className="font-bold">Galeri Resmini Kırp {pendingFiles.length > 1 && `(${pendingFiles.length} resim kaldı)`}</h3>
                            <div className="flex gap-2">
                                {aspectRatios.map((r) => (
                                    <button
                                        key={r.label}
                                        type="button"
                                        onClick={() => setAspect(r.value as any)}
                                        className={`px-3 py-1 text-xs rounded-full border transition-all ${aspect === r.value ? 'bg-blue-600 border-blue-600' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}
                                    >
                                        {r.label}
                                    </button>
                                ))}
                                <div className="w-[1px] h-4 bg-gray-700 mx-1"></div>
                                <button
                                    type="button"
                                    onClick={handleSelectAll}
                                    className="px-3 py-1 text-xs rounded-full border bg-gray-800 border-gray-700 hover:bg-gray-700 flex items-center gap-1"
                                >
                                    <Maximize size={12} />
                                    Tümünü Seç
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setImageToCrop(null)}
                                className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white"
                            >
                                Vazgeç
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveCrop}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-lg"
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
                            minZoom={0.2}
                            restrictPosition={false}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            onMediaLoaded={(mediaSize: any) => {
                                setImageAspect(mediaSize.width / mediaSize.height);
                            }}
                        />
                    </div>

                    <div className="p-6 bg-gray-900 border-t border-gray-800 text-white shrink-0">
                        <div className="max-w-xs mx-auto">
                            <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-widest text-center">Yakınlaştır : {Math.round(zoom * 100)}%</p>
                            <input
                                type="range"
                                value={zoom}
                                min={0.2}
                                max={3}
                                step={0.1}
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
