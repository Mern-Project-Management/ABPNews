'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Article, getArticleUrl } from '@/lib/getNewsData';

interface LeadHeroProps {
  leadStory: Article;
  trendingNews: Article[];
  allArticles?: Article[];
}

export default function LeadHero({ leadStory, trendingNews, allArticles = [] }: LeadHeroProps) {
  // Build 4-5 distinct article slides
  const slides = React.useMemo(() => {
    const list = [leadStory, ...trendingNews];
    const uniqueMap = new Map<string, Article>();
    list.forEach(item => {
      if (item && item.id && !uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });
    return Array.from(uniqueMap.values()).slice(0, 5);
  }, [leadStory, trendingNews]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length, nextSlide]);

  const currentStory = slides[currentIndex] || leadStory;

  // Combine trending and all articles to get up to 10 unique stories for the 2-column grid (5 rows of 2)
  const leftGridStories = React.useMemo(() => {
    const pool = [...trendingNews, ...allArticles];
    const seen = new Set<string>();
    if (currentStory?.id) seen.add(currentStory.id);

    const result: Article[] = [];
    for (const item of pool) {
      if (item && item.id && !seen.has(item.id)) {
        seen.add(item.id);
        result.push(item);
        if (result.length >= 10) break;
      }
    }
    return result;
  }, [trendingNews, allArticles, currentStory?.id]);

  const rightTextStories = trendingNews.slice(0, 3);

  // Trending list of up to 8 ranked stories
  const trendingDisplayStories = React.useMemo(() => {
    const pool = [...trendingNews, ...allArticles];
    const seen = new Set<string>();
    const result: Article[] = [];
    for (const item of pool) {
      if (item && item.id && !seen.has(item.id)) {
        seen.add(item.id);
        result.push(item);
        if (result.length >= 8) break;
      }
    }
    return result;
  }, [trendingNews, allArticles]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT/MAIN COLUMN (2 columns wide) */}
        <div className="lg:col-span-2">
          {/* Main Article Slider Banner */}
          <div 
            className="relative group rounded-md overflow-hidden shadow-md bg-gray-900 mb-2"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-900">
              {slides.map((story, idx) => (
                <div
                  key={story.id || idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === currentIndex ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <Link href={getArticleUrl(story)} className="block w-full h-full relative group/link bg-black overflow-hidden">
                    {/* Blurred dynamic backdrop to fill 16:9 canvas cleanly */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 scale-110 pointer-events-none"
                      style={{ backgroundImage: `url(${story.image})` }}
                    />
                    
                    {/* Full sharp image fitted without cropping or stretching */}
                    <img 
                      src={story.image && !story.image.includes('abplive') ? story.image : '/metrotimes_default.png'} 
                      alt={story.title} 
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/metrotimes_default.png';
                      }}
                      className="relative z-1 w-full h-full object-contain transition-transform duration-700 group-hover/link:scale-102" 
                    />

                    {/* Gradient overlay for readable headline text */}
                    <div className="absolute inset-0 z-2 bg-gradient-to-t from-black/95 via-black/35 to-transparent flex flex-col justify-end p-5 sm:p-7">
                      <span className="inline-block bg-[#E30613] text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded w-max mb-2.5 shadow-sm">
                        {story.category || 'Lead Story'}
                      </span>
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight drop-shadow-md group-hover/link:text-red-200 transition-colors">
                        {story.title}
                      </h1>
                    </div>
                  </Link>
                </div>
              ))}

              {/* Prev / Next Controls */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      prevSlide();
                    }}
                    aria-label="Previous Article"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-[#E30613] text-white p-2.5 rounded-full opacity-80 hover:opacity-100 transition-all focus:outline-none shadow-lg transform active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      nextSlide();
                    }}
                    aria-label="Next Article"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-[#E30613] text-white p-2.5 rounded-full opacity-80 hover:opacity-100 transition-all focus:outline-none shadow-lg transform active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Interactive Slide Pagination Indicator Bar & Dots */}
          <div className="flex justify-center items-center space-x-2 my-4 py-1">
            {slides.map((story, idx) => (
              <button
                key={story.id || idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Slide ${idx + 1}: ${story.title}`}
                title={story.title}
                className={`transition-all duration-300 focus:outline-none cursor-pointer rounded-full ${
                  idx === currentIndex
                    ? 'w-8 h-2 bg-[#E30613] ring-2 ring-red-200 shadow-sm'
                    : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          {/* Grid of smaller stories (2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mt-6">
            {leftGridStories.map(item => (
              <Link 
                key={item.id} 
                href={getArticleUrl(item)} 
                className="group flex flex-col cursor-pointer block"
              >
                <span className="text-[11px] font-bold text-[#E30613] uppercase tracking-wide block mb-1.5">
                  {item.category}
                </span>
                <div className="flex space-x-3 items-start">
                  <div className="w-[100px] h-[65px] shrink-0 overflow-hidden rounded-sm bg-gray-100">
                    <img 
                      src={item.image && !item.image.includes('abplive') ? item.image : '/metrotimes_default.png'} 
                      alt={item.title} 
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/metrotimes_default.png';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <h3 className="text-[15px] font-semibold text-[#004b79] group-hover:text-[#E30613] leading-snug line-clamp-3">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN (1 column wide) */}
        <div className="lg:col-span-1 space-y-6 lg:pl-4">
          
          {/* Text List of stories */}
          <div className="space-y-5 pt-2">
            {rightTextStories.map(item => (
              <Link 
                key={item.id} 
                href={getArticleUrl(item)}
                className="group cursor-pointer block"
              >
                <span className="text-[11px] font-bold text-[#E30613] uppercase tracking-wide block mb-1">
                  {item.category}
                </span>
                <h3 className="text-[17px] font-semibold text-[#004b79] group-hover:text-[#E30613] leading-snug line-clamp-3">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>

          {/* TRENDING SECTION */}
          <div className="pt-4">
            {/* Orange Header */}
            <div className="bg-gradient-to-r from-orange-400 to-amber-500 py-1.5 px-3 flex items-center mb-4 rounded-sm">
              <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h2 className="text-white font-extrabold text-sm uppercase tracking-wider m-0 leading-none mt-0.5">
                TRENDING
              </h2>
            </div>
            
            {/* Trending List */}
            <div className="space-y-4">
              {trendingDisplayStories.slice(0, 8).map((item, index) => (
                <Link 
                  key={item.id} 
                  href={getArticleUrl(item)}
                  className="flex items-start space-x-3 group border-b border-gray-100 pb-3 last:border-0 last:pb-0 cursor-pointer block"
                >
                  <span className="text-3xl font-bold text-gray-300 group-hover:text-[#E30613] transition-colors shrink-0 leading-none mt-1">
                    {index + 1}
                  </span>
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-bold text-[#E30613] uppercase tracking-wide">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-semibold text-[#004b79] group-hover:text-[#E30613] transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

