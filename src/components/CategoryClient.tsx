'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveTVModal from '@/components/LiveTVModal';
import SearchModal from '@/components/SearchModal';
import { getArticleUrl, fetchLiveNewsDataset, NewsDataset } from '@/lib/getNewsData';
import { Clock, ChevronRight } from 'lucide-react';

interface CategoryClientProps {
  slug: string;
  initialNewsData: NewsDataset;
}

export default function CategoryClient({
  slug,
  initialNewsData,
}: CategoryClientProps) {
  const [newsData, setNewsData] = useState<NewsDataset>(initialNewsData);

  useEffect(() => {
    const loadData = async () => {
      const liveData = await fetchLiveNewsDataset();
      if (liveData) setNewsData(liveData);
    };
    loadData();
  }, []);

  const [isLiveTVOpen, setIsLiveTVOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const categoryName = (slug || 'india').toUpperCase();
  const articles = newsData.allArticles.filter((a) => {
    const cUpper = (slug || 'india').toUpperCase();
    const aCat = (a.category || '').toUpperCase();
    return aCat === cUpper || aCat.includes(cUpper) || cUpper.includes(aCat);
  });
  const displayArticles = articles.length > 0 ? articles : newsData.allArticles.slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      {/* HEADER */}
      <Header
        categories={newsData.categories}
        ticker={newsData.ticker}
        tickerArticles={
          displayArticles.filter(a => a.isBreaking).length > 0
            ? displayArticles.filter(a => a.isBreaking)
            : displayArticles.length > 0 
              ? displayArticles 
              : newsData.allArticles
        }
        marketTicker={newsData.marketTicker}
        weatherData={newsData.weatherData}
        onOpenLiveTV={() => setIsLiveTVOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">
        {/* BREADCRUMB */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500 pb-3 border-b border-gray-200">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-bold uppercase">{categoryName}</span>
        </div>

        {/* CATEGORY HEADER */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight flex items-center space-x-2">
            <span>{categoryName} News</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Latest stories, breaking developments, and live coverage from {categoryName}
          </p>
        </div>

        {/* ARTICLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayArticles.map((article) => (
            <Link
              key={article.id}
              href={getArticleUrl(article)}
              className="group bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100 relative">
                <img
                  src={article.image || '/metrotimes_default.png'}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                    {article.category}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-red-600 line-clamp-2 mt-1 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-50">
                  <Clock className="w-3 h-3 text-red-500" />
                  <span>{article.time}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer categories={newsData.categories} />
      <LiveTVModal isOpen={isLiveTVOpen} onClose={() => setIsLiveTVOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} articles={newsData.allArticles} />
    </div>
  );
}
