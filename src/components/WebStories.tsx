'use client';

import React, { useState } from 'react';
import { Layers, ChevronRight, X, ChevronLeft } from 'lucide-react';
import { WebStory } from '@/lib/getNewsData';

interface WebStoriesProps {
  stories: WebStory[];
}

export default function WebStories({ stories }: WebStoriesProps) {
  const [activeStory, setActiveStory] = useState<WebStory | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  if (!stories || stories.length === 0) return null;

  const openStory = (story: WebStory) => {
    setActiveStory(story);
    setCurrentSlideIndex(0);
  };

  const nextSlide = () => {
    if (activeStory && currentSlideIndex < activeStory.slides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      setActiveStory(null);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-amber-500">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-amber-500 text-gray-950 rounded-md">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 uppercase tracking-wider">
            Web Stories
          </h2>
        </div>
        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Visual Highlights
        </span>
      </div>

      {/* STORIES CAROUSEL */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {stories.map((story) => (
          <div 
            key={story.id}
            onClick={() => openStory(story)}
            className="relative aspect-[9/14] rounded-2xl overflow-hidden cursor-pointer group shadow-lg border-2 border-transparent hover:border-red-600 transition-all duration-300"
          >
            <img 
              src={story.image} 
              alt={story.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            <div className="absolute top-3 left-3 bg-amber-500 text-gray-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {story.category}
            </div>

            <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
              <span className="text-[10px] font-semibold text-gray-300 flex items-center space-x-1">
                <Layers className="w-3 h-3 text-amber-400" />
                <span>{story.slides} Slides</span>
              </span>
              <h3 className="text-xs sm:text-sm font-bold leading-snug line-clamp-2 text-amber-100 group-hover:text-white transition-colors">
                {story.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* FULLSCREEN STORY MODAL SLIDESHOW */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm aspect-[9/16] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col justify-between p-4">
            
            {/* PROGRESS BARS */}
            <div className="flex space-x-1 z-20">
              {Array.from({ length: activeStory.slides }).map((_, i) => (
                <div key={i} className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-red-600 transition-all duration-300 ${
                      i <= currentSlideIndex ? 'w-full' : 'w-0'
                    }`} 
                  />
                </div>
              ))}
            </div>

            {/* TOP BAR */}
            <div className="flex items-center justify-between z-20 pt-2 text-white">
              <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                {activeStory.category}
              </span>
              <button 
                onClick={() => setActiveStory(null)} 
                className="p-1 text-gray-300 hover:text-white bg-black/40 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* SLIDE BACKGROUND IMAGE */}
            <img 
              src={activeStory.image} 
              alt={activeStory.title}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />

            {/* CLICK CONTROLS */}
            <div className="absolute inset-0 z-10 flex">
              <div className="w-1/2 h-full cursor-pointer" onClick={prevSlide} />
              <div className="w-1/2 h-full cursor-pointer" onClick={nextSlide} />
            </div>

            {/* SLIDE FOOTER CONTENT */}
            <div className="z-20 text-white space-y-2 pb-4">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wide">
                Slide {currentSlideIndex + 1} of {activeStory.slides}
              </span>
              <h3 className="text-base font-extrabold text-white leading-snug">
                {activeStory.title}
              </h3>
              <p className="text-xs text-gray-300">
                Tap right for next slide, left to go back. Stay updated with Metrotimes web stories.
              </p>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
