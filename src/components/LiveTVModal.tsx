'use client';

import React from 'react';
import { X, Tv, Volume2, ShieldCheck, Radio, Play, Users, MessageSquare } from 'lucide-react';

import { VideoItem } from '@/lib/getNewsData';

interface LiveTVModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVideo?: VideoItem | null;
}

export default function LiveTVModal({ isOpen, onClose, selectedVideo }: LiveTVModalProps) {
  if (!isOpen) return null;

  const isLocalVideo = selectedVideo?.sourceType === 'local' && !!selectedVideo?.videoUrl;
  const isCustomYoutube = !isLocalVideo && !!selectedVideo?.youtubeId;
  const embedUrl = isCustomYoutube
    ? `https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&mute=0&rel=0`
    : `https://www.youtube-nocookie.com/embed/live_stream?channel=UC9k-yiEpRHMNVOnOi_aQK8w&autoplay=1&mute=0`;

  const videoTitle = selectedVideo?.title || 'Metrotimes English Live Broadcast';
  const categoryBadge = selectedVideo?.category || 'Metrotimes TV 24x7';

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl text-white">
        
        {/* MODAL HEADER */}
        <div className="bg-gray-950 px-6 py-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>{categoryBadge}</span>
            </div>
            <span className="text-xs text-gray-400 font-medium hidden sm:inline truncate max-w-[400px]">
              {videoTitle}
            </span>
          </div>

          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* EMBEDDED PLAYER / STREAM CONTAINER */}
        <div className="relative aspect-[16/9] w-full bg-black flex items-center justify-center">
          {isLocalVideo ? (
            <video 
              src={selectedVideo?.videoUrl} 
              poster={selectedVideo?.thumbnail}
              controls 
              autoPlay 
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <iframe 
              src={embedUrl} 
              title={videoTitle}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        {/* LIVE STREAM FOOTER */}
        <div className="p-4 sm:p-6 bg-gray-950 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-800">
          <div className="space-y-1 text-center sm:text-left flex-1 min-w-0 pr-4">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <Radio className="w-4 h-4 text-red-500 animate-pulse shrink-0" />
              <h4 className="text-sm font-bold text-white line-clamp-1">
                {videoTitle}
              </h4>
            </div>
            <p className="text-xs text-gray-400 line-clamp-1">
              Exclusive Video Report & Ground Coverage from Metrotimes
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-semibold shrink-0">
            {selectedVideo?.views && (
              <span className="flex items-center space-x-1.5 bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700">
                <Users className="w-4 h-4 text-amber-400" />
                <span>{selectedVideo.views}</span>
              </span>
            )}
            <button 
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
