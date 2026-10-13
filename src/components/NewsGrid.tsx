'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, ChevronRight } from 'lucide-react';
import { Article, getArticleUrl } from '@/lib/getNewsData';

interface NewsGridProps {
  title: string;
  categorySlug?: string;
  articles: Article[];
  variant?: 'grid' | 'horizontal' | 'featured-left';
}

export default function NewsGrid({ title, categorySlug, articles, variant = 'grid' }: NewsGridProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-[#E30613]">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-7 bg-[#E30613] rounded-sm" />
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-wider">
            {title}
          </h2>
        </div>

        {categorySlug && (
          <Link 
            href={`/category/${categorySlug}`}
            className="flex items-center space-x-1 text-xs font-bold text-[#E30613] hover:text-red-800 uppercase tracking-wide transition-colors"
          >
            <span>VIEW ALL</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* GRID LAYOUT VARIANT (CLEAN LIGHT CARDS) */}
      {variant === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.slice(0, 4).map((item) => (
            <Link 
              key={item.id} 
              href={getArticleUrl(item)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex flex-col group cursor-pointer block"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img 
                  src={item.image && !item.image.includes('abplive') ? item.image : '/metrotimes_default.png'} 
                  alt={item.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/metrotimes_default.png';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-[#E30613] text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                  {item.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <span className="text-[11px] text-gray-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-[#E30613]" />
                    <span>{item.time}</span>
                  </span>

                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#E30613] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">{item.author}</span>
                  <span className="text-[#E30613] font-bold group-hover:underline">
                    Read &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* FEATURED LEFT VARIANT (CLEAN LIGHT CARDS) */}
      {variant === 'featured-left' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main big item */}
          {articles[0] && (
            <Link 
              href={getArticleUrl(articles[0])}
              className="lg:col-span-6 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 group cursor-pointer block"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-900">
                <img 
                  src={articles[0].image && !articles[0].image.includes('abplive') ? articles[0].image : '/metrotimes_default.png'} 
                  alt={articles[0].title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/metrotimes_default.png';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-[#E30613] text-white font-bold text-[10px] px-2.5 py-1 rounded uppercase tracking-wider">
                  {articles[0].category}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5 text-[#E30613]" />
                  <span>{articles[0].time}</span>
                  <span>•</span>
                  <span>{articles[0].readTime}</span>
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-[#E30613] transition-colors leading-snug">
                  {articles[0].title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-3">
                  {articles[0].summary}
                </p>
              </div>
            </Link>
          )}

          {/* Right side list items */}
          <div className="lg:col-span-6 space-y-4">
            {articles.slice(1, 4).map((item) => (
              <Link 
                key={item.id} 
                href={getArticleUrl(item)}
                className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 flex items-center space-x-4 group hover:shadow-md transition-shadow cursor-pointer block"
              >
                <div className="w-24 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden shrink-0 relative bg-gray-100">
                  <img 
                    src={item.image && !item.image.includes('abplive') ? item.image : '/metrotimes_default.png'} 
                    alt={item.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/metrotimes_default.png';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-bold text-[#E30613] uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#E30613] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-gray-500 block pt-0.5">
                    {item.time}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
