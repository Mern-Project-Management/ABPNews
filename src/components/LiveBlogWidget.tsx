'use client';

import React, { useState } from 'react';
import { Radio, Mic, Play, Pause, Clock, Volume2, ShieldCheck } from 'lucide-react';
import { LiveBlogItem, PodcastItem } from '@/lib/getNewsData';

interface LiveBlogWidgetProps {
  updates: LiveBlogItem[];
  podcasts: PodcastItem[];
}

export default function LiveBlogWidget({ updates, podcasts }: LiveBlogWidgetProps) {
  const [playingPodcast, setPlayingPodcast] = useState<PodcastItem | null>(null);

  const togglePodcast = (pod: PodcastItem) => {
    if (playingPodcast?.id === pod.id) {
      setPlayingPodcast(null);
    } else {
      setPlayingPodcast(pod);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: REAL-TIME LIVE BLOG TIMELINE (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-sm border border-gray-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-red-600 text-white rounded-lg">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900 uppercase tracking-wider">
                  Live Blog & Timeline
                </h3>
                <span className="text-[11px] text-gray-500 font-medium">Real-time minute-by-minute updates</span>
              </div>
            </div>
            <span className="bg-red-50 text-red-600 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-red-200 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>LIVE FEED</span>
            </span>
          </div>

          <div className="space-y-3 relative before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-red-200 pl-8">
            {updates.map((item, idx) => (
              <div key={idx} className="relative group">
                <span className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-red-600 ring-4 ring-red-100" />
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/70 space-y-1">
                  <span className="text-[11px] font-bold text-red-600 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.time}</span>
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-snug">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Metrotimes PODCASTS & AUDIO PLAYER (5 Cols) */}
        <div className="lg:col-span-5 bg-white text-gray-900 rounded-2xl p-5 shadow-sm border border-gray-200 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-amber-500 text-white rounded-lg shadow-xs">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold uppercase tracking-wider text-gray-900">
                Metrotimes Podcasts
              </h3>
            </div>
            <span className="text-xs text-amber-600 font-bold uppercase tracking-wide">
              Listen Now
            </span>
          </div>

          <div className="space-y-3">
            {podcasts.map((pod) => (
              <div 
                key={pod.id}
                onClick={() => togglePodcast(pod)}
                className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 flex items-center space-x-3 ${
                  playingPodcast?.id === pod.id 
                    ? 'bg-red-50 border-red-500 shadow-xs' 
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100/80'
                }`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 relative bg-gray-100 border border-gray-200">
                  <img src={pod.image} alt={pod.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    {playingPodcast?.id === pod.id ? (
                      <Pause className="w-5 h-5 text-white fill-current" />
                    ) : (
                      <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">
                    {pod.host} • {pod.duration}
                  </span>
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                    {pod.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          {/* PLAYING BOTTOM BAR */}
          {playingPodcast && (
            <div className="p-3 bg-red-600 rounded-xl flex items-center justify-between shadow-md text-white animate-fadeIn">
              <div className="flex items-center space-x-2 min-w-0">
                <Volume2 className="w-4 h-4 shrink-0 animate-bounce" />
                <span className="text-xs font-bold truncate">Playing: {playingPodcast.title}</span>
              </div>
              <button 
                onClick={() => setPlayingPodcast(null)}
                className="bg-black/30 hover:bg-black/50 px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer"
              >
                Stop
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
