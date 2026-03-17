"use client";

import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Check, Facebook, Twitter, MessageCircle } from 'lucide-react';

interface BlogShareButtonsProps {
  url: string;
  title: string;
}

const BlogShareButtons: React.FC<BlogShareButtonsProps> = ({ url, title }) => {
  const [copied, setCopied] = useState(false);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`,
    // Instagram doesn't support direct URL sharing via web links easily, usually users copy link
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-gray-500 mr-2 hidden md:inline-block italic">Paylaş:</span>
      
      {/* Facebook */}
      <a 
        href={shareUrls.facebook} 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
        title="Facebook'ta Paylaş"
      >
        <Facebook size={18} />
      </a>

      {/* Twitter / X */}
      <a 
        href={shareUrls.twitter} 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-gray-50 text-gray-900 hover:bg-black hover:text-white transition-all duration-300"
        title="X'te Paylaş"
      >
        <Twitter size={18} />
      </a>

      {/* WhatsApp */}
      <a 
        href={shareUrls.whatsapp} 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300"
        title="WhatsApp'ta Paylaş"
      >
        <MessageCircle size={18} />
      </a>

      {/* Instagram - Since no direct link, we focus on copy link or just provide the brand icon that triggers copy */}
      <button 
        onClick={copyToClipboard}
        className="p-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white transition-all duration-300"
        title="Bağlantıyı Kopyala"
      >
        <svg 
            viewBox="0 0 24 24" 
            width="18" 
            height="18" 
            stroke="currentColor" 
            strokeWidth="2" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      </button>

      {/* Copy Link */}
      <button 
        onClick={copyToClipboard}
        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
          copied ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        title="Bağlantıyı Kopyala"
      >
        {copied ? <Check size={16} /> : <LinkIcon size={16} />}
        <span className="text-xs font-bold uppercase tracking-wider">{copied ? 'Kopyalandı' : 'Kopyala'}</span>
      </button>
    </div>
  );
};

export default BlogShareButtons;
